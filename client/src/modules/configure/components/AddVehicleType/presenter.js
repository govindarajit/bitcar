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
import { status } from "../../../../constants";
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

const AddVehicleTypePresenter = ({
  data,
  isOpen,
  toggle,
  showImage,
  handleZoom,
  onChangePicture,
  onChangeInput,
  button,
  onAddVehicleType,
  updateAccount
}) => {
  
  return (
    <div className="animated fadeIn">
      <Card>
        <CardHeader>
           Vehicle  Type
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
            <Label> Car icon </Label>
              <ImageInput
                image={data.picture}
                label="img_picture"
                name="img_picture"
                onChange={onChangePicture()}
                is
                ratio="75%"
                backgroundImg
                handleZoom={handleZoom(data.picture)}
              />
            </Col>
            <Col md="8">
              <Row>
                <Col md="6">
                  <FormGroup row>
                    <Label sm={4} htmlFor="vehicle_name">
                      Vehicle Name
                    </Label>
                    <Col sm={8}>
                      <Input
                        name="vehicle_name"
                        value={data.vehicle_name}
                        onChange={onChangeInput}                        
                      />
                    </Col>
                  </FormGroup>
                  
                  <FormGroup row>
                    <Label sm={4} htmlFor="long_description">
                      Long Description
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="textarea"
                        name="long_description"
                        value={data.long_description}
                        id="long_description"
                        onChange={onChangeInput}
                        
                      />
                    </Col>
                  </FormGroup>
                  
                </Col>
                <Col md="6">
                    <FormGroup row>
                        <Label for="numberOfRow" sm={4}>
                        Short Description
                        </Label>
                        <Col sm={8}>
                        <Input
                            name="short_description"
                            value={data.short_description}
                            onChange={onChangeInput}                            
                        />
                        </Col>
                        <Label />
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={4} htmlFor="">
                        Status
                        </Label>
                        <Col sm={8}>
                        <Input
                            type="select"
                            name="status"
                            id="status"
                            onChange={onChangeInput}
                            value={data.status}
                            
                        >
                            {status.map((item, id) => (
                            <option key={id}>{item}</option>
                            ))}
                        </Input>
                        </Col>
                    </FormGroup>
                  <FormGroup row>
                    <Col md="4" />
                    <Col md="8">
                        {button === 'add' && 
                            <Button onClick={onAddVehicleType} color="primary"> Add </Button>
                        }
                        {button !== 'add' && 
                            <Button  onClick={updateAccount} color="primary"> Edit </Button>
                        }
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

export default AddVehicleTypePresenter;
