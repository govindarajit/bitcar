import React, { Component } from 'react';
import {
	Card,
	CardBody,
	Col,
	Table,
	Badge,
	Row,
	ButtonDropdown, 
	DropdownToggle, 
	DropdownMenu, 
	DropdownItem,
	FormGroup,
	Label,
	Input
} from 'reactstrap';
import { TBPagination } from '../../../../common/Pagination';
import { trip_status, history_trip_status } from '../../../../../constants';
function formatDate(date){
	date = new Date(date);
	date = date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes();
	return date
}
const TripBookingPresenter = props => {
	const { list, filter, onChangeFilter, onChangePage, onDropdownToggle, actionDropdownOpen, tripId, bookingType, countries, cities } = props;
	const { page, total_pages } = props.params;
	return (
		<div className="animated fadeIn">
			<Card>

				<CardBody>
					<Row>
						<Col md="12">
							<FormGroup row>
								<Label for="country" sm={1}>
									Country
								</Label>
								<Col sm={3}>
									<Input
										type="select"
										name="country"
										id="country"
										onChange={onChangeFilter}
										value={filter.country}
									>
										<option value="all">All</option>
										{countries.length>0 && countries.map((item) => (
											<option key={item._id} value={item._id}>
												{item.country_name}
											</option>
										))}
									</Input>
								</Col>
								<Label for="region" sm={1}>
									City
								</Label>
								<Col sm={3}>
									<Input
										type="select"
										name="region"
										id="region"
										onChange={onChangeFilter}
										value={filter.region}
									>
										<option value="all">All</option>
										{cities.length>0 && cities.map((item) => (
											<option key={item._id} value={item._id}>
												{item.city_name}
											</option>
										))}
									</Input>
								</Col>
								<Label for="status" sm={1}>
									Status
								</Label>
								<Col sm={3}>
									<Input
										type="select"
										name="status"
										id="status"
										onChange={onChangeFilter}
										value={filter.status}
									>
										<option value="all">All</option>
										{(bookingType === 'nowBooking' || bookingType === 'laterBooking') && trip_status.map((item, id) => (
											<option key={id} value={item}>
												{item}
											</option>
										))}
										{(bookingType === 'historyBooking' || bookingType === 'laterBooking') && history_trip_status.map((item, id) => (
											<option key={id} value={item}>
												{item}
											</option>
										))}
									</Input>
								</Col>
							</FormGroup>
						</Col>
					</Row>
					<React.Fragment>
						<Table responsive>
							<thead>
								<tr>
									<th>Trip Id</th>
									<th>Rider Detail</th>
									<th>Driver Detail</th>
									<th>Pickup address</th>
									<th>Dropoff address</th>
									{bookingType==="laterBooking" &&
										<th>Pickup Time</th>
									}
									<th>Status</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{list.length === 0 &&
									<tr>
										<th style={{textAlign:'center'}} colSpan={8}>Not Found</th>
									</tr>
								}
								{list.length > 0 && list.map(item => (
									<tr key={item._id}>
										<td>
											{item._id}
										</td>
										<td>
											<a href={`?#/rider/info/${item.rider._id}`}>{item.rider.name.first_name + item.rider.name.last_name}</a>
										</td>
										<td>
											<a href={`?#/driver/info/${item.driver._id}`}>{item.driver.name.first_name + item.driver.name.last_name}</a>
										</td>
										<td>
											{item.pickupAddress} 
										</td>
										<td>
											{item.dropAddress} 
										</td>
										{bookingType==="laterBooking" &&
											<td>{formatDate(item.pickupDate)}</td>
										}
										<td>
											<Badge className="label-status">{item.booking_status}</Badge>
										</td>
										<td>
										<ButtonDropdown isOpen={(tripId === item._id) && actionDropdownOpen} toggle={onDropdownToggle}>
											<DropdownToggle  id={item._id} color="primary" caret>
											Action
											</DropdownToggle>
											<DropdownMenu>
												<a href={`?#/trip/tripInfo/${item._id}`}>
													<DropdownItem>View</DropdownItem>
												</a>
											</DropdownMenu>
										</ButtonDropdown>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
						<TBPagination page={page} total_pages={total_pages} onClick={onChangePage} />
					</React.Fragment>
				</CardBody>
			</Card>
		</div>
	);
};

export default TripBookingPresenter;
