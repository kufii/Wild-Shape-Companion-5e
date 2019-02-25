import { Platform, Alert } from 'react-native';
import Toast from 'react-native-root-toast';
import { getPref, setPref } from './user-prefs';
import { toDict } from './util';
import { lightTheme, darkTheme } from './constants';
import { getStruct } from '../components/screens/homebrew/details/form';
import t from 'tcomb-validation';
import * as RNIap from 'react-native-iap';
import beasts from '../data/beasts.json';
import products from '../data/iap.json';

const homebrewStruct = getStruct();

export const initialState = {
	isLoading: true,
	iaps: [],
	showAds: Platform.OS === 'ios',
	darkMode: false,
	level: 0,
	isMoon: false,
	favs: {},
	homebrew: [],
	beasts
};

export const actions = (update, states) => {
	const privateActions = {
		cleanupFavs: favs => Object.entries(favs)
			.filter(([_, value]) => value)
			.reduce(toDict(([key]) => key, () => true), {}),
		getHomebrewImportMergeList: beasts => new Promise((resolve, reject) => {
			const toImport = [];

			const iterate = (function*() {
				for (const beast of beasts) {
					yield beast;
				}
			}());
			const next = () => {
				const { value, done } = iterate.next();
				if (done) {
					resolve(toImport);
				} else if (!t.validate(value, homebrewStruct).isValid()) {
					reject(new Error('Invalid Data'));
				} else if (states().beasts.find(b => b.name === value.name)) {
					next();
				} else if (states().homebrew.find(b => b.name === value.name)) {
					Alert.alert(
						`${value.name} Already Exists`,
						`There is already an existing homebrew named ${value.name}.`,
						[
							{
								text: 'Cancel',
								style: 'cancel',
								onPress: () => resolve([])
							},
							{
								text: 'Skip',
								onPress: () => next()
							},
							{
								text: 'Replace',
								onPress: () => {
									toImport.push(value);
									next();
								}
							}
						]
					);
				} else {
					toImport.push(value);
					next();
				}
			};
			next();
		})
	};
	const actions = {
		loadPrefs: () => Promise.all([
			getPref('showAds', true),
			getPref('darkMode', false),
			getPref('level', 0),
			getPref('isMoon', false),
			getPref('favs', {}),
			getPref('homebrew', [])
		]).then(
			([showAds, darkMode, level, isMoon, favs, homebrew]) => update({
				showAds: Platform.OS === 'ios' && showAds,
				darkMode,
				level,
				isMoon,
				favs,
				homebrew,
				isLoading: false
			})
		),
		async loadProducts() {
			try {
				await RNIap.initConnection();
				const iaps = await RNIap.getProducts(Platform.select(products));
				update({ iaps });
			} catch (e) {
				console.log(e);
			} finally {
				try {
					await RNIap.endConnection();
				} catch (e) {
					console.log(e);
				}
			}
		},
		async restorePurchases() {
			try {
				await RNIap.initConnection();
				const purchases = await RNIap.getAvailablePurchases();
				const showAds = Platform.OS === 'ios' && purchases.length === 0;
				Toast.show(showAds ? 'No purchases found to restore.' : 'Thank you for supporting Druidshape 5e!');
				update({ showAds });
				setPref('showAds', showAds);
			} catch (e) {
				console.log(e);
			} finally {
				try {
					await RNIap.endConnection();
				} catch (e) {
					console.log(e);
				}
			}
		},
		async buyProduct(productId) {
			try {
				await RNIap.initConnection();
				await RNIap.clearTransaction();
				await RNIap.buyProduct(productId);
				await RNIap.finishTransaction();
				Toast.show('Thank you for supporting Druidshape 5e!');
				update({ showAds: false });
				setPref('showAds', false);
			} catch (e) {
				console.log(e);
			} finally {
				try {
					await RNIap.endConnection();
				} catch (e) {
					console.log(e);
				}
			}
		},
		setDarkMode: darkMode => {
			update({ darkMode });
			setPref('darkMode', darkMode);
		},
		getCurrentTheme: () => states().darkMode ? darkTheme : lightTheme,
		toggleMoon: () => {
			const isMoon = !states().isMoon;
			update({ isMoon });
			setPref('isMoon', isMoon);
		},
		setLevel: level => {
			level = parseInt(level);
			update({ level });
			setPref('level', level);
		},
		toggleFav: name => {
			const favs = states().favs;
			favs[name] = !favs[name];
			update({ favs });
			setPref('favs', favs);
		},
		addHomebrew: beast => {
			const homebrew = [...states().homebrew, beast];
			update({ homebrew });
			setPref('homebrew', homebrew);
		},
		editHomebrew: (name, beast) => {
			const homebrew = [...states().homebrew.filter(h => h.name !== name), beast];
			let favs = states().favs;
			if (name !== beast.name) {
				favs[beast.name] = favs[name];
				favs[name] = false;
				favs = privateActions.cleanupFavs(favs);
				setPref('favs', favs);
			}
			update({ homebrew, favs });
			setPref('homebrew', homebrew);
		},
		deleteHomebrew: name => {
			const homebrew = states().homebrew.filter(h => h.name !== name);
			let favs = states().favs;
			favs[name] = false;
			favs = privateActions.cleanupFavs(favs);
			update({ homebrew, favs });
			setPref('homebrew', homebrew);
			setPref('favs', favs);
		},
		importHomebrews: beasts => privateActions
			.getHomebrewImportMergeList(beasts)
			.then(beasts => {
				if (beasts.length > 0) {
					let homebrew = states().homebrew;
					beasts.forEach(b => {
						homebrew = homebrew.filter(h => h.name !== b.name);
						homebrew.push(b);
					});
					update({ homebrew });
					setPref('homebrew', homebrew);
					Toast.show('Import complete.');
				}
			}),
		getAllBeasts: () => [...states().beasts, ...states().homebrew],
		getBeast: name => actions.getAllBeasts().find(b => b.name === name),
		getFavorites: () => Object.entries(states().favs)
			.filter(([_, isFav]) => isFav)
			.map(([key]) => actions.getBeast(key))
			.filter(b => b)
	};
	return actions;
};
