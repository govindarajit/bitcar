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
import Countries from './Countries/Countries';
import Cities from './Cities/Cities';

const RegionPresenter = props => {
	return (
		<div className="animated fadeIn">
			<Card>
				<CardHeader>
					<i className="icon-map" /> Regions
				</CardHeader>
                <CardBody>
                    <Nav id='navBar' tabs>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: props.activeTab === '1' })}
                            onClick={() => { props.onToggle('1'); }}
                            >
                            Countries
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: props.activeTab === '2' })}
                            onClick={() => { props.onToggle('2'); }}
                            >
                            Cities
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={props.activeTab}>
                        <TabPane tabId="1">
                            <Countries />
                        </TabPane>
                        <TabPane tabId="2">
                            <Cities />
                        </TabPane>
                    </TabContent>
                </CardBody>
				
			</Card>
		</div>
	);
};

export default RegionPresenter;
