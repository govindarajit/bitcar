import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import 'react-dates/initialize';

// Styles
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss';
import 'react-dates/lib/css/_datepicker.css';
// Import Main styles for this application
import '../scss/style.scss';

// Views
import { Login } from './modules/auth';

import { Container } from 'reactstrap';
import Header from './modules/common/Header/';
import Sidebar from './modules/common/Sidebar/';
import Breadcrumb from './modules/common/Breadcrumb/';
import Aside from './modules/common/Aside/';
import Footer from './modules/common/Footer/';

import PrivateRoute from './modules/common/PrivateRoute';
import Spinners from './modules/common/Spinners/';
import Toastr from './modules/common/Toastr/';

import { Driver, DriverInfo } from './modules/driver';
import { Rider, RiderInfo } from './modules/rider';
import { Vehicle, AddVehicleType, AddVehicleModel, Region, AddCities, AddCountries } from './modules/configure';
import { Trip, TripInfo } from './modules/trip';
import { ForgotPassword } from './modules/auth';
import { SetPassword } from './modules/auth';

export default class App extends Component {
	render() {
		return (
			<div>
				<HashRouter>
					<Switch>
						<Route exact path="/login" name="Login Page" component={Login} />
						<Route exact path="/forgotPassword" name="Forgot Password Page" component={ForgotPassword} />
						<Route exact path="/setPassword" name="Set Password Page" component={SetPassword} />
						{/* <Route path="/" name="Home" component={MainApp} /> */}
						<PrivateRoute path="/" name="Home" component={MainApp} />
					</Switch>
				</HashRouter>
				<Spinners />
				<Toastr />
			</div>
		);
	}
}

class MainApp extends Component {
	render() {
		return (
			<div className="app">
				<Header />
				<div className="app-body">
					<Sidebar {...this.props} />
					<main className="main">
						<Breadcrumb />
						<Container fluid>
							<Switch>
								<Route exact path="/driver/list" name="DriverList" component={Driver} />
								<Route exact path="/driver/info/:id" name="DriverList" component={DriverInfo} />
								<Route exact path="/rider/list" name="RiderList" component={Rider} />
								<Route exact path="/rider/info/:id" name="RiderList" component={RiderInfo} />
								<Route exact path="/configure/vehicles" name="Vehicles" component={Vehicle} />
								<Route exact path="/configure/vehiclesTypeInfo/:id" name="Vehicles" component={AddVehicleType} />
								<Route exact path="/configure/vehiclesModelInfo/:id" name="Vehicles" component={AddVehicleModel} />
								<Route exact path="/configure/regions" name="Vehicles" component={Region} />
								<Route exact path="/configure/citiesInfo/:id" name="Vehicles" component={AddCities} />
								<Route exact path="/configure/countriesInfo/:id" name="Vehicles" component={AddCountries} />
								<Route exact path="/trip/list" name="Trips" component={Trip} />
								<Route exact path="/trip/tripInfo/:id" name="Trips" component={TripInfo} />
								<Redirect from="/" to="/driver/list" />
							</Switch>
						</Container>
					</main>
					<Aside />
				</div>
				<Footer />
			</div>
		);
	}
}
