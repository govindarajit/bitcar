import React, { Component } from 'react';
import {
	Card,
	CardBody,
	Col,
	Table,
	Badge,
	Button,
	ButtonDropdown, 
	DropdownToggle, 
	DropdownMenu, 
	DropdownItem
} from 'reactstrap';
import { TBPagination } from '../../../../common/Pagination';
const CountriesPresenter = props => {
	const { list, onChangePage, onDropdownToggle, actionDropdownOpen, countriesListId, onDelete } = props;
	const { page, total_pages } = props.params;
	return (
		<div className="animated fadeIn">
			<Card>

				<CardBody>
                    <Col sm={12} style={{ textAlign:'right', padding:10}}>
						<a href={`?#/configure/countriesInfo/add`}>
							<Button color="primary"> Add </Button>
						</a>	
					</Col>
                
					{list.length > 0 && (
						<React.Fragment>
							<Table responsive>
								<thead>
									<tr>
										<th>Country Name</th>
										<th>Currency Unit</th>
										<th>Distance Unit</th>
										<th>Status</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{list.length>0 && list.map(item => (
										<tr key={item._id}>
											<td>
                                                {item.country_name}
											</td>
											<td>
												{item.currency_unit}
											</td>
											<td>
												{item.distance_unit}
											</td>
											<td>
												<Badge className="label-status">{item.status}</Badge>
											</td>
											<td>
											<ButtonDropdown isOpen={(countriesListId === item._id) && actionDropdownOpen} toggle={onDropdownToggle}>
												<DropdownToggle  id={item._id} color="primary" caret>
												Action
												</DropdownToggle>
												<DropdownMenu>
													<a href={`?#/configure/countriesInfo/${item._id}`}>
														<DropdownItem>Edit</DropdownItem>
													</a>
													<DropdownItem id={item._id} onClick={props.onDelete}>Delete</DropdownItem>
												</DropdownMenu>
											</ButtonDropdown>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
							<TBPagination page={page} total_pages={total_pages} onClick={props.onChangePage} />
						</React.Fragment>
					)}
				</CardBody>
			</Card>
		</div>
	);
};

export default CountriesPresenter;
