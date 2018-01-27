'use strict';

// TODO(Sushim) : Enable this when being used.
const CalendarItemService = require('../../services/calendar-item-service');
const _ = require('lodash');
const calendarItemJson = {
    schedule: {
        date: '2017-10-26T13:30:00.603+0000',
        duration: 3600000,
        location: {
            scope_type: '',
            status: 'ACTIVE',
            version: 1,
            accuracy: 10,
            address_string: 'Challaghatta, Bengaluru, Karnataka, India',
            battery: 0,
            device_manufacturer: 'OnePlus',
            latitude: 12.930318454262375,
            longitude: 77.64035370200872,
            timestamp: 1508317622272
        }
    },
    data: {
        vo: {
            code: 'TEST_VO',
            start_state: 'customer',
            module: 'customers',
            state: 'customer',
            name: 'TEST_VO',
            attributes: {}
        },
        task: {
            attributes: {
                engagement: true
            },
            code: 'customers_meeting',
            type: 'meeting'
        },
        user: {
            name: 'TEST_USER',
            code: 'TEST_USER'
        }
    },
    create_inputs: [{
        code: 'meeting',
        name: 'Meeting',
        sub_type: 'location',
        type: 'meeting',
        value: '{"date":"2017-10-26T13:30:00.603+0000","duration":3600000,"location":{"scope_type":"","status":"ACTIVE","version":1,"accuracy":10.0,"address":{"m_address_lines":{"0":"Challaghatta","1":"Bengaluru, Karnataka","2":"India"},"m_admin_area":"Karnataka","m_country_code":"IN","m_country_name":"India","m_feature_name":"Challaghatta","m_has_latitude":true,"m_has_longitude":true,"m_latitude":12.9505711,"m_locale":"en_US","m_locality":"Bengaluru","m_longitude":77.6445168,"m_max_address_line_index":2,"m_sub_admin_area":"Bangalore Urban","m_sub_locality":"Challaghatta"},"address_string":"Challaghatta, Bengaluru, Karnataka, India","battery":0.0,"burst":{"locations":[]},"device_manufacturer":"OnePlus","latitude":12.930318454262375,"longitude":77.64035370200872,"timestamp":1508317622272}}'
    },
    {
        code: 'purpose',
        name: 'Purpose',
        type: 'code_name_spinner',
        value: 'On Boarding'
    }],
    assigned: {
        date: '2017-10-18T09:08:19.305Z',
        code: 'TEST_USER',
        server_date: '2017-10-18T09:08:19.305Z',
        name: 'TEST_USER'
    },
    created: {
        date: '2017-10-18T09:08:19.305Z',
        server_date: '2017-10-18T09:08:19.305Z',
        code: 'TEST_USER',
        name: 'TEST_USER'
    },
    last_updated: {
        date: '2017-10-18T09:08:19.305Z',
        server_date: '2017-10-18T09:08:19.305Z',
        code: 'TEST_USER',
        name: 'TEST_USER'
    },
    mode: 'SCHEDULED',
    state: 'OPEN',
    category: 'VO_CALENDAR_ITEM',
    name: 'Meeting',
    source: 'USER'
};

let calendarItemId = '';


describe('Services.CalendarItemService.js', function () {
    describe('createCalendarItem', function () {
        it('it should create calendar item', () => {
            return CalendarItemService.createCalendarItem('configtest', calendarItemJson)
                .then(calendarItem => {
                    calendarItemId = _.get(calendarItem, 'code');
                    return expect(calendarItem).to.have.property('_id');
                });
        });
    });
    describe('getCalendarItem', function () {
        it('it should fetch calendar with item id', () => {
            return CalendarItemService.getCalendarItem('configtest', calendarItemId)
                .then(calendarItem => {
                    const fetchedCalendarItemId = _.get(calendarItem, 'code');
                    return expect(fetchedCalendarItemId).equal(calendarItemId);
                });
        });
    });
    describe('getCalendarItems', function () {
        it(`it should fetch calendar items with all filter params`, () => {
            const params = {
                voId: calendarItemJson.data.vo.code,
                created: 'TEST_USER',
                start: '2017-10-25',
                update: 'TEST_USER',
                assigned: 'TEST_USER'
            };
            return CalendarItemService.getCalendarItems('configtest', params)
                .then(result => {
                    const calendarItem = _.get(result, 'results')[0];
                    expect(_.get(calendarItem, 'data.vo.code')).equal(calendarItemJson.data.vo.code);
                    expect(_.get(calendarItem, 'created.code')).equal('TEST_USER');
                    expect(_.get(calendarItem, 'last_updated.code')).equal('TEST_USER');
                    expect(_.get(calendarItem, 'assigned.code')).equal('TEST_USER');
                });
        });
    });
    describe('updateCalendarItem', function () {
        it('it should reassign calendar item', () => {
            calendarItemJson.code = calendarItemId;
            calendarItemJson.assigned.code = 'TEST_USER_2';
            return CalendarItemService.updateCalendarItem('configtest', calendarItemJson)
                .then(calendarItem => {
                    return expect(_.get(calendarItem, 'assigned.code')).equal('TEST_USER_2');
                }).catch(err => {
                    console.log(err);
                });
        });
    });
    describe('updateCalendarItem', function () {
        it('it should update calendar item state', () => {
            calendarItemJson.code = calendarItemId;
            calendarItemJson.state = 'COMPLETED';
            return CalendarItemService.updateCalendarItem('configtest', calendarItemJson)
                .then(calendarItem => {
                    expect(_.get(calendarItem, 'state')).equal('COMPLETED');
                });
        });
    });
    describe('updateCalendarItem', function () {
        it('it should not update calendar item state [illegal state transition]', () => {
            calendarItemJson.code = calendarItemId;
            calendarItemJson.state = 'OPEN';
            return CalendarItemService.updateCalendarItem('configtest', calendarItemJson)
                .catch(err => {
                    return chai.assert.typeOf(err, 'Error');
                });
        });
    });
});
