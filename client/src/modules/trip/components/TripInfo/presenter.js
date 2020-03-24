import React, { Component } from "react";
import {GoogleApiWrapper, Map, Marker, Polyline} from 'google-maps-react';
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Label,
} from "reactstrap";

const TripInfoPresenter = ({
  data,
  path,
  startPoint,
  endPoint
}) => {
  let bounds = new window.google.maps.LatLngBounds();
  for (var i = 0; i < path.length; i++) {
    bounds.extend(path[i]);
  }
  return (
    <div className="animated fadeIn">
      <Card>
        <CardHeader>
           Trip Info
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="12">
              <Row style={{height:400, position:'relative'}}>
                <Map google={window.google}                  
                  bounds={bounds}
                >
                  <Marker
                    position={startPoint}
                  />
                   <Polyline
                      path={path}
                      strokeColor="#6e98ee"
                      strokeOpacity={1}
                      strokeWeight={4} 
                    />
                   <Marker
                    position={endPoint}
                  />
                </Map>
              </Row>
              <Row>
                <Label sm={3}>
                  Rider Id
                </Label>
                <Label sm={3}>
                  <a href={`?#/rider/info/${data.riderId}`}>{data.riderId}</a>
                </Label>
                <Label sm={3}>
                  Driver Id
                </Label>
                <Label sm={3}>
                  <a href={`?#/driver/info/${data.driverId}`}>{data.driverId}</a>
                </Label>
                <Label sm={3}>
                  Rider Name
                </Label>
                <Label sm={3}>
                  {data.riderName}
                </Label>
                <Label sm={3}>
                  Driver Name
                </Label>
                <Label sm={3}>
                  {data.driverName}
                </Label>
                <Label sm={3}>
                  Rider Phone
                </Label>
                <Label sm={3}>
                  {data.riderPhone}
                </Label>
                <Label sm={3}>
                  Driver Phone
                </Label>
                <Label sm={3}>
                  {data.driverPhone}
                </Label>
              </Row>
              <hr />
              <Row>
                <Label sm={3}>
                  Pickup Location
                </Label>
                <Label sm={9}>
                  {data.pickupLoc}
                </Label>
                <Label sm={3}>
                  Dropoff Location
                </Label>
                <Label sm={9}>
                  {data.dropOffLoc}
                </Label>
                <Label sm={3}>
                  Car Type
                </Label>
                <Label sm={9}>
                  {data.carType}
                </Label>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: ('AIzaSyCR_IWHQZb1tARqY1BS6tL6xA2ZoBDsL1o')
})(TripInfoPresenter)
