import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Viewer from "react-viewer";
import { ActionType } from "react-viewer/lib/Icon";

import ImageInput from "../../../common/ImageInput";
import BitcarSelectInput from "../../../common/Input";
import { rider_status_list } from "../../../../constants";
import "react-viewer/dist/index.css";

const toolbar = [
  {
    key: "zoomIn",
    actionType: ActionType.zoomIn
  },
  {
    key: "zoomOut",
    actionType: ActionType.zoomOut
  },
  {
    key: "reset",
    actionType: ActionType.reset
  },
  {
    key: "rotateLeft",
    actionType: ActionType.rotateLeft
  },
  {
    key: "rotateRight",
    actionType: ActionType.rotateRight
  }
];

const RiderInfoPresenter = ({
  data,
  isOpen,
  toggle,
  showImage,
  handleZoom,
  updateAccount,
  isUpdate,
  allowUpdate,
  onChangePicture,
  onChangeInput,
}) => {
  if (!data) return null;
  return (
    <div className="animated fadeIn">
      <Card>
        <CardHeader>
          <i className="icon-map" /> Driver Info
        </CardHeader>
        <CardBody>
          <Viewer
            visible={isOpen}
            onClose={toggle}
            images={[{ src: showImage, alt: "img" }]}
            zIndex={1080}
            onMaskClick={toggle}
            customToolbar={() => toolbar}
          />

          <Row>
            <Col md="4">
              <ImageInput
                image={data.picture}
                label="img_picture"
                name="img_picture"
                onChange={onChangePicture()}
                isDisabled={!isUpdate}
                ratio="75%"
                backgroundImg
                handleZoom={handleZoom(data.picture)}
              />
            </Col>
            <Col md="8">
              <Row>
                <Col md="6">
                  <FormGroup row>
                    <Label sm={4} htmlFor="first_name">
                      First Name
                    </Label>
                    <Col sm={8}>
                      <Input
                        name="first_name"
                        value={data.first_name}
                        onChange={onChangeInput}
                        disabled={!isUpdate}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="numberOfRow" sm={4}>
                      Region
                    </Label>
                    <Col sm={8}>
                      <BitcarSelectInput
                        name="branch"
                        onChange={onChangeInput}
                        value={data.branch}
                        isDisabled={!isUpdate}
                      />
                    </Col>
                    <Label />
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4} htmlFor="phone_number">
                      Mobile
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="tel"
                        pattern="(09|01[2|6|8|9])+([0-9]{8})"
                        name="phone_number"
                        value={data.phone_number}
                        id="phone_number"
                        onChange={onChangeInput}
                        disabled={!isUpdate}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4} htmlFor="identity_card">
                      ID Number
                    </Label>
                    <Col sm={8}>
                      <Input
                        name="identity_card"
                        value={data.identity_card}
                        onChange={onChangeInput}
                        disabled={!isUpdate}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4} htmlFor="">
                      Status
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="select"
                        name="activation_status"
                        id="activation_status"
                        onChange={onChangeInput}
                        value={data.activation_status}
                        disabled={!isUpdate}
                      >
                        {rider_status_list.map((item, id) => (
                          <option key={id}>{item}</option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup row>
                    <Label sm={4} htmlFor="last_name">
                      Last Name
                    </Label>
                    <Col sm={8}>
                      <Input
                        name="last_name"
                        value={data.last_name}
                        onChange={onChangeInput}
                        disabled={!isUpdate}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4} htmlFor="branch_city">
                      City
                    </Label>
                    <Col sm={8}>
                      <Input
                        name="branch_city"
                        value={data.branch_city}
                        onChange={onChangeInput}
                        disabled={!isUpdate}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4} htmlFor="">
                      Email
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={onChangeInput}
                        disabled={!isUpdate}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4} htmlFor="">
                      Invite code
                    </Label>
                    <Col sm={8}>
                      <Label />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4" />
                    <Col md="8">
                      {isUpdate ? (
                        <Button
                          type="submit"
                          color="primary"
                          onClick={updateAccount}
                        >
                          Save
                        </Button>
                      ) : (
                        <Button onClick={allowUpdate} color="primary">
                          Edit
                        </Button>
                      )}
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default RiderInfoPresenter;
