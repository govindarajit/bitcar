import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  NavLink,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  CardTitle,
  CardText,
  Button,
  Row,
  Col,
  Form,
  Table,
  Badge,
  Pagination,
  PaginationItem,
  PaginationLink,
  FormGroup,
  Label,
  Input,
  InputGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

import ImageInput, { AvatarInput } from "../../../common/ImageInput";
import TBSelectInput from "../../../common/Input";

import classnames from "classnames";

import { driving_license_list } from "../../../../constants";

const AddDriverPresenter = props => {
  const { data, onChangeInput, onChangeImage } = props;
  return <div className="animated fadeIn">
			<Form onSubmit={props.onSubmit}>
				<Row>
					<Col md="6">
						<Card>
							<CardHeader>
								<i className="icon-map" /> Thêm tài xế
							</CardHeader>
							<CardBody>
								<FormGroup row id="row-add-avatar">
									<Col md="4">
										<AvatarInput image={data.avatar_url} label="avatar_url" onChange={onChangeImage} />
									</Col>
									<Label md="3" htmlFor="avatar_url">
										Hình đại diện
									</Label>
								</FormGroup>
								<FormGroup>
									<Label htmlFor="accountName">Tên tài xế</Label>
									<Input type="text" name="full_name" id="accountName" placeholder="Trần Minh Long" value={data.full_name} onChange={onChangeInput} required />
								</FormGroup>
								<FormGroup>
									<Label htmlFor="email">Email</Label>
									<Input type="email" name="email" id="email" placeholder="longtm@gmail.com" onChange={onChangeInput} value={data.email} required />
								</FormGroup>
								<FormGroup>
									<Label htmlFor="phoneNumber">Số điện thoại liên hệ</Label>
									<Input type="tel" pattern="(09|01[2|6|8|9])+([0-9]{8})" name="phone_number" value={data.phone_number} id="phoneNumber" onChange={onChangeInput} placeholder="01676719148" required />
								</FormGroup>
								<FormGroup>
									<Label htmlFor="phone_number_1">Số điện thoại phụ</Label>
									<Input type="tel" pattern="(09|01[2|6|8|9])+([0-9]{8})" name="phone_number_1" value={data.phone_number_1} id="phone_number_1" onChange={onChangeInput} placeholder="01676719148" />
								</FormGroup>
								<FormGroup>
									<Label htmlFor="address">Địa chỉ nhà</Label>
									<Input type="text" name="street" value={data.street} onChange={onChangeInput} id="address" placeholder="Nhập địa chỉ nhà" required />
								</FormGroup>
								<FormGroup>
									<Label for="province">Tỉnh/Thành phố</Label>
									<TBSelectInput province name="province" id="province" onChange={onChangeInput} value={data.province} />
								</FormGroup>
								<FormGroup>
									<Label for="driving_license">Bằng lái</Label>
									<Input type="select" name="driving_license" id="driving_license" onChange={onChangeInput} value={data.driving_license}>
										{driving_license_list.map((item, id) => <option key={id}>{item}</option>)}
									</Input>
								</FormGroup>
								<FormGroup>
									<Label htmlFor="personalId">Số CMND</Label>
									<Input type="number" name="id" onChange={onChangeInput} id="personalId" value={data.id} placeholder="Nhập số chứng minh nhân dân" required />
								</FormGroup>
								<FormGroup>
									<Label htmlFor="note">Ghi chú</Label>
									<Input type="textarea" name="note" onChange={onChangeInput} value={data.note} id="note" placeholder="làm việc tốt, có kinh nghiệm" rows="4" />
								</FormGroup>
								<FormGroup>
									<Button type="submit" color="primary">
										Thêm
									</Button>
									{'  '}
									<Button type="reset">Xóa</Button>
								</FormGroup>
							</CardBody>
						</Card>
					</Col>
					<Col md="6">
						<Card>
							<CardHeader>
								<i className="icon-map" /> Bằng lái xe
							</CardHeader>
							<CardBody>
								<ImageInput image={data.img_front_side} label="img_front_side" onChange={onChangeImage} ratio="56.25%" />
								<ImageInput image={data.img_back_side} label="img_back_side" onChange={onChangeImage} ratio="56.25%" />
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Form>
		</div>;
};

export default AddDriverPresenter;
