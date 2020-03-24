import React, { Component } from 'react';
import {
	Card,
	CardHeader,
	CardBody,
	Row,
	Col,
	Table,
	Badge,
	FormGroup,
	Label,
	Input,
	InputGroup,
	Button,
	InputGroupAddon,
	ButtonDropdown, 
	DropdownToggle, 
	DropdownMenu, 
	DropdownItem
} from 'reactstrap';
import { TBPagination } from '../../../common/Pagination';
import { rider_status_list, imageExample } from '../../../../constants';

const RiderPresenter = props => {
	const { list, filter, onChangeFilter, keyword, onChangeKeyword, onSearch, onEnter, onDropdownToggle, actionDropdownOpen, riderId
		, countries, cities } = props;
	const { page, total_pages } = props.params;
	return (
		<div className="animated fadeIn">
			<Card>
				<CardHeader>
					<i className="icon-map" /> Rider list
				</CardHeader>

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
								<Label for="activation_status" sm={1}>
									Status
								</Label>
								<Col sm={3}>
									<Input
										type="select"
										name="status"
										id="activation_status"
										onChange={onChangeFilter}
										value={filter.status}
									>
										<option value="all">All</option>
										{rider_status_list.map((item, id) => (
											<option key={id} value={item}>
												{item}
											</option>
										))}
									</Input>
								</Col>
							</FormGroup>
						</Col>
						<Col md="12">
							<FormGroup row>
								<Label for="keyword" sm={1}>
									Search
								</Label>
								<Col sm={3}>
									<InputGroup>
										<Input
											name="keyword"
											id="keyword"
											value={keyword}
											onChange={onChangeKeyword}
											onKeyPress={onEnter}
										/>
										<InputGroupAddon addonType="append">
											<Button onClick={onSearch}>
												<i className="fa fa-search" />
											</Button>
										</InputGroupAddon>
									</InputGroup>
								</Col>
							</FormGroup>
						</Col>
					</Row>
					<React.Fragment>
						<Table responsive>
							<thead>
								<tr>
									<th>Profile Picture</th>
									<th>Name</th>
									<th>Phone</th>
									<th>City</th>
									<th>Topup Balance</th>
									<th>Referral Balance</th>
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
									<tr key={item.id}>
										<th scope="row">
											<img
												src={item.picture ? item.picture : imageExample}
												className="img-avatar"
												name="avatar"
												id="avatar"
												alt="admin@bootstrapmaster.com"
												width="50"
												height="50"
											/>
										</th>
										<td>
											<a href={`?#/rider/info/${item.id}`}>
												{item.name.first_name + ' ' + item.name.last_name}
											</a>
										</td>
										<td>{item.phone_number}</td>
										<td>{item.branchName}</td>
										<td>200 RM</td>
										<td>10 RM</td>
										<td>
											<Badge className="label-status">{item.activation_status}</Badge>
										</td>
										<td>
										<ButtonDropdown isOpen={(riderId === item.id) && actionDropdownOpen} toggle={onDropdownToggle}>
											<DropdownToggle  id={item.id} color="primary" caret>
											Action
											</DropdownToggle>
											<DropdownMenu>
												<a href={`?#/rider/info/${item.id}`}>
													<DropdownItem>Edit</DropdownItem>
												</a>
												<a href={`?#/rider/info/${item.id}`}>
													<DropdownItem>View Histories</DropdownItem>
												</a>
												<a href={`?#/rider/info/${item.id}`}>
													<DropdownItem>View Referral</DropdownItem>
												</a>
											</DropdownMenu>
										</ButtonDropdown>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
						<TBPagination page={page} total_pages={total_pages} onClick={props.onChangePage} />
					</React.Fragment>
				</CardBody>
			</Card>
		</div>
	);
};

export default RiderPresenter;
