import { combineReducers } from 'redux';
import {
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
} from './setData';

export default combineReducers({
	country: setCountry,
	language: setLanguage,
	dataprofiles: setProfiles,
	//Flight
	requestFlight: setRequestFlight,
	flightValues: setFlightValues,
	itemFlightAvail: setItemFlightAvail,
	flightHolderContact: setFlightHolderContact,
	flightPax: setFlightPax,
	valueFilterFlight: setValueFilterFlight,
	listchild: setListChild,
	infoUser: setInfomation,
	listClassChat: setListClassChat
});
