import {
	SETCOUNTRY,
	SETLANGUAGE,
	SETPROFILES,
	SET_REQUEST_FLIGHT_AVAIL,
	SET_FLIGHT_VALUES,
	SET_ITEM_FLIGHT_AVAIL,
	SET_FLIGHT_HOLDER_CONTACT,
	SET_FLIGHT_PAX,
	SET_VALUE_FILTER_FLIGHT,
	SET_LIST_CHILD,
	GET_INFOMATION,
	GET_LIST_CLASS_CHAT
} from '../actions/type';

const initialState = {};

function setInfomation(state = {}, action) {
	switch (action.type) {
		case GET_INFOMATION:
			return action.data;
		default:
			return state;
	}
}

function setListChild(state = [], action) {
	switch (action.type) {
		case SET_LIST_CHILD:
			return action.data;
		default:
			return state;
	}
}

function setCountry(state = initialState, action) {
	switch (action.type) {
		case SETCOUNTRY:
			return action.data;
		default:
			return state;
	}
}

function setLanguage(state = initialState, action) {
	switch (action.type) {
		case SETLANGUAGE:
			return action.data;
		default:
			return state;
	}
}

function setProfiles(state = initialState, action) {
	switch (action.type) {
		case SETPROFILES:
			return action.data;
		default:
			return state;
	}
}

function setRequestFlight(state = initialState, action) {
	switch (action.type) {
		case SET_REQUEST_FLIGHT_AVAIL:
			return action.data;
		default:
			return state;
	}
}

function setFlightValues(state = initialState, action) {
	switch (action.type) {
		case SET_FLIGHT_VALUES:
			return action.data;
		default:
			return state;
	}
}

function setItemFlightAvail(state = initialState, action) {
	switch (action.type) {
		case SET_ITEM_FLIGHT_AVAIL:
			return action.data;
		default:
			return state;
	}
}
function setFlightHolderContact(state = initialState, action) {
	switch (action.type) {
		case SET_FLIGHT_HOLDER_CONTACT:
			return action.data;
		default:
			return state;
	}
}
function setFlightPax(state = initialState, action) {
	switch (action.type) {
		case SET_FLIGHT_PAX:
			return action.data;
		default:
			return state;
	}
}
function setValueFilterFlight(state = initialState, action) {
	switch (action.type) {
		case SET_VALUE_FILTER_FLIGHT:
			return action.data;
		default:
			return state;
	}
}

function setListClassChat(state = initialState, action) {
	switch (action.type) {
		case GET_LIST_CLASS_CHAT:
			return action.data;
		default:
			return state;
	}
}

export {
	setCountry,
	setLanguage,
	setProfiles,
	setRequestFlight,
	setFlightValues,
	setItemFlightAvail,
	setFlightHolderContact,
	setFlightPax,
	setValueFilterFlight,
	setListChild,
	setInfomation,
	setListClassChat
};
