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
	SET_REQUEST_FILTER_FLIGHT,
	SET_LIST_CHILD,
	GET_INFOMATION,
	GET_LIST_CLASS_CHAT
} from './type';

export const setCountry = (val) => ({ type: SETCOUNTRY, data: val });
export const setLanguage = (val) => ({ type: SETLANGUAGE, data: val });
export const setProfiles = (val) => ({ type: SETPROFILES, data: val });
export const setRequestFlight = (val) => ({ type: SET_REQUEST_FLIGHT_AVAIL, data: val });
export const setFlightValues = (val) => ({ type: SET_FLIGHT_VALUES, data: val });
export const setItemFlightAvail = (val) => ({ type: SET_ITEM_FLIGHT_AVAIL, data: val });
export const setFlightHolderContact = (val) => ({ type: SET_FLIGHT_HOLDER_CONTACT, data: val });
export const setFlightPax = (val) => ({ type: SET_FLIGHT_PAX, data: val });
export const setValueFilterFlight = (val) => ({ type: SET_VALUE_FILTER_FLIGHT, data: val });
export const setListChild = (val) => ({ type: SET_LIST_CHILD, data: val });
//--------------------
export const getInfomation = data => ({ type: GET_INFOMATION, data })

export const setListClassChat = data => ({ type: GET_LIST_CLASS_CHAT, data })

