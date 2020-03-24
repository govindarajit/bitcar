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
import { imageExample } from '../../../../../constants';
const VehicleListPresenter = props => {
	const { list, onChangePage, onDropdownToggle, actionDropdownOpen, vehicleListId, onDeleteVehicleType } = props;
	const { page, total_pages } = props.params;
	return (
		<div className="animated fadeIn">
			<Card>

				<CardBody>
                    <Col sm={12} style={{ textAlign:'right', padding:10}}>
						<a href={`?#/configure/vehiclesTypeInfo/add`}>
							<Button color="primary"> Add </Button>
						</a>	
					</Col>
                
					{list.length > 0 && (
						<React.Fragment>
							<Table responsive>
								<thead>
									<tr>
										<th>Vehicle Type</th>
										<th>Vehicle Icon</th>
										<th>Status</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{list.map(item => (
										<tr key={item._id}>
											<td>
                                                {item.vehicle_name}
											</td>
											<td>
												<img
													src={item.picture ? item.picture : imageExample}
													className="img-avatar"
													name="avatar"
													id="avatar"
													alt="admin@bootstrapmaster.com"
													width="50"
													height="50"
												/>
											</td>
											<td>
												<Badge className="label-status">{item.status}</Badge>
											</td>
											<td>
											<ButtonDropdown isOpen={(vehicleListId === item._id) && actionDropdownOpen} toggle={onDropdownToggle}>
												<DropdownToggle  id={item._id} color="primary" caret>
												Action
												</DropdownToggle>
												<DropdownMenu>
													<a href={`?#/configure/vehiclesTypeInfo/${item._id}`}>
														<DropdownItem>Edit</DropdownItem>
													</a>
													<DropdownItem id={item._id} onClick={props.onDeleteVehicleType}>Delete</DropdownItem>
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

export default VehicleListPresenter;
