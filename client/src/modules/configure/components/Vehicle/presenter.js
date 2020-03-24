import React, { Component } from 'react';
import {
	Card,
	CardHeader,
    CardBody, 
    TabPane, 
    Nav, 
    NavItem, 
    NavLink, 
    Button, 
    CardTitle, 
    CardText, 
    Row, 
    Col,
    TabContent,
} from 'reactstrap';
import classnames from 'classnames';
import VehicleList from './VehicleType/VehicleList';
import VehicleModel from './VehicleModel/VehicleModel';

const VehiclePresenter = props => {
	return (
		<div className="animated fadeIn">
			<Card>
				<CardHeader>
					<i className="icon-map" /> Vehicle
				</CardHeader>
                <CardBody>
                    <Nav id='navBar' tabs>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: props.activeTab === '1' })}
                            onClick={() => { props.onToggle('1'); }}
                            >
                            Types
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: props.activeTab === '2' })}
                            onClick={() => { props.onToggle('2'); }}
                            >
                            Models
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={props.activeTab}>
                        <TabPane tabId="1">
                            <VehicleList />
                        </TabPane>
                        <TabPane tabId="2">
                            <VehicleModel />
                        </TabPane>
                    </TabContent>
                </CardBody>
				
			</Card>
		</div>
	);
};

export default VehiclePresenter;
