import { getPref } from './user-prefs';
import beasts from '../data/beasts.json';

export const initialState = {
	isLoading: true,
	level: 0,
	isMoon: false,
	favs: {},
	homebrew: [],
	beasts
};

export const actions = (update, states) => ({
	loadPrefs: () => Promise.all([
		getPref('level', 0),
		getPref('isMoon', false),
		getPref('favs', {}),
		getPref('homebrew', [])
	]).then(
		([level, isMoon, favs, homebrew]) => update({ level, isMoon, favs, homebrew, isLoading: false })
	),
	toggleFav: name => {
		const favs = states().favs;
		favs[name] = !favs[name];
		update({ favs });
	},
	addHomebrew: beast => update({ homebrew: [...states().homebrew, beast] }),
	getAllBeasts: () => [...states().beasts, ...states().homebrew]
});