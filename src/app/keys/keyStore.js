//- Tất cả các keys được lưu trên máy thông qua AsyncStore
//- Kiểm tra trước khi add keys để tránh trùng lặp

export const nkey = {
	//--general
	lang: 'lang',
	token: 'token',
	//--user
	avatar: 'avatar',
	phonenumber: 'phonenumber',
	nameuser: 'nameuser',
	password: 'password',
	Fullname: 'Fullname',
	PhoneNumber: 'PhoneNumber',
	cmnd: 'cmnd',
	Strgender: 'Strgender',
	DiaChi: 'DiaChi',
	IDKHDPS: 'IDKHDPS',
	// 1: Email, 2: SDT, 3: Google, 4: Facebook
	typeLogin: '1',
	// infoUser sau khi loginByOuthToken(firstName,lastName,idAcc,email)
	infoUser: 'infoUser',
	RecentSearch: 'RecentSearch',
	country: 'country',
	NotificationPushList: 'NotificationPushList',
	SearchFlight: 'SearchFlight'
};
