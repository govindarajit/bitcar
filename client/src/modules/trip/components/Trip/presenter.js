import React, { Component } from 'react';
import {
	Card,
	CardHeader,
    CardBody, 
    TabPane, 
    Nav, 
    NavItem, 
    NavLink, 
    TabContent,
} from 'reactstrap';
import classnames from 'classnames';
import TripBooking from './TripBooking/TripBooking'

const TripPresenter = props => {
	return (
		<div className="animated fadeIn">
			<Card>
				<CardHeader>
					<i className="icon-map" /> Trips
				</CardHeader>
                <CardBody>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: props.activeTab === '1' })}
                            onClick={() => { props.onToggle('1'); }}
                            >
                            Now Booking
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: props.activeTab === '2' })}
                            onClick={() => { props.onToggle('2'); }}
                            >
                            Later Booking
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: props.activeTab === '3' })}
                            onClick={() => { props.onToggle('3'); }}
                            >
                            History Booking
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={props.activeTab}>
                        <TabPane tabId="1">
                            <TripBooking bookingType={'nowBooking'} />
                        </TabPane>
                        <TabPane tabId="2">
                            <TripBooking bookingType={'laterBooking'} />
                        </TabPane>
                        <TabPane tabId="3">
                            <TripBooking bookingType={'historyBooking'} />
                        </TabPane>
                    </TabContent>
                </CardBody>
				
			</Card>
		</div>
	);
};

export default TripPresenter;
