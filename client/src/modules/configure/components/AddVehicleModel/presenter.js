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
import { status } from "../../../../constants";
import "react-viewer/dist/index.css";

const AddVehiclePresenter = ({
  data,
  onChangeInput,
  button,
  onAddVehicle,
  updateAccount,
  vehicles
}) => {
  
  return (
    <div className="animated fadeIn">
      <Card>
        <CardHeader>
           Vehicle  Type
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="4">
              <FormGroup row>
                <Label sm={4} htmlFor="vehicle_name">
                  Vehicle Name
                </Label>
                <Col sm={8}>
                  <Input
                        type="select"
                        name="vehicle_name"
                        id="vehicle_name"
                        onChange={onChangeInput}
                        value={data.vehicle_name}
                        disabled={button !== 'add'}                        
                    >
                        <option value='' >Select</option>
                        {vehicles.map((item) => (
                        <option key={item.vehicle_name}>{item.vehicle_name}</option>
                        ))}
                    </Input>
                </Col>
              </FormGroup>
            </Col>
            <Col md="8">
              <Row>
                <Col md="6">
                  <FormGroup row>
                    <Label sm={4} htmlFor="vehicle_model">
                      Vehicle Model
                    </Label>
                    <Col sm={8}>
                      <Input
                        name="vehicle_model"
                        value={data.vehicle_model}
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
                            <Button onClick={onAddVehicle} color="primary"> Add </Button>
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

export default AddVehiclePresenter;
