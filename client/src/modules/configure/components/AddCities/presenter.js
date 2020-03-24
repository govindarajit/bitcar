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

const AddCitiesPresenter = ({
  data,
  onChangeInput,
  button,
  onAddVehicle,
  updateAccount,
  onCheckbox,
  vehicleTypeList,
  countries
}) => {
  
  return (
    <div className="animated fadeIn">
      <Card>
        <CardHeader>
           Cities
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="4">
              <FormGroup row>
                <Label sm={4} htmlFor="country_name">
                  Country Name
                </Label>
                <Col sm={8}>
                  <Input
                        type="select"
                        name="country_name"
                        id="country_name"
                        onChange={onChangeInput}
                        value={data.country_name}
                        disabled={button !== 'add'}                        
                    >
                        <option value='' >Select</option>
                        {countries.map((item) => (
                        <option key={item.country_name}>{item.country_name}</option>
                        ))}
                    </Input>
                </Col>
              </FormGroup>
            </Col>
            <Col md="8">
              <Row>
                <Col md="12">
                  <FormGroup row>
                    <Label sm={2} htmlFor="city_name">
                      City Name
                    </Label>
                    <Col sm={4}>
                      <Input
                        name="city_name"
                        value={data.city_name}
                        onChange={onChangeInput}
                      />
                    </Col>
                    <Label sm={2} htmlFor="">
                    Status
                    </Label>
                    <Col sm={4}>
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
                </Col>
                <Col md="12">
                  <FormGroup row>
                      <Label for="numberOfRow" sm={2}>
                      Vehicle Type
                      </Label>
                      <Col sm={10}>
                        <FormGroup check>
                          {vehicleTypeList.map((item)=> (
                            <span key={item._id}>
                              <Input type="checkbox" name="check" id={item._id} value={item._id} onClick={onCheckbox}/>
                              <Label style={{ width:130 }} check>{item.vehicle_name}</Label>
                            </span>
                          ))}                         
                        </FormGroup>
                      </Col>
                      <Label />
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

export default AddCitiesPresenter;
