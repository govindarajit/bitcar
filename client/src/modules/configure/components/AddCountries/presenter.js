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

const AddCountriesPresenter = ({
  data,
  onChangeInput,
  button,
  onAddVehicleType,
  updateAccount
}) => {
  
  return (
    <div className="animated fadeIn">
      <Card>
        <CardHeader>
           Countries
        </CardHeader>
        <CardBody>

          <Row>
            <Col md="12">
              <Row>
                <Col md="6">
                  <FormGroup row>
                    <Label sm={4} htmlFor="country_name">
                      Country Name
                    </Label>
                    <Col sm={8}>
                      <Input
                        name="country_name"
                        value={data.country_name}
                        onChange={onChangeInput}   
                        id="country_name"                     
                      />
                    </Col>
                  </FormGroup>
                  
                  <FormGroup row>
                    <Label sm={4} htmlFor="currency_unit">
                      Currency Unit
                    </Label>
                    <Col sm={8}>
                      <Input
                        name="currency_unit"
                        value={data.currency_unit}
                        id="currency_unit"
                        onChange={onChangeInput}
                        
                      />
                    </Col>
                  </FormGroup>
                  
                </Col>
                <Col md="6">
                    <FormGroup row>
                        <Label for="numberOfRow" sm={4} htmlFor="distance_unit">
                        Distance Unit
                        </Label>
                        <Col sm={8}>
                        <Input
                            name="distance_unit"
                            value={data.distance_unit}
                            onChange={onChangeInput}
                            id="distance_unit"                            
                        />
                        </Col>
                        <Label />
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={4} htmlFor="status">
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

export default AddCountriesPresenter;
