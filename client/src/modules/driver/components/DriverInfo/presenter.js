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
import { SingleDatePicker } from "react-dates";
import moment from "moment";
import Viewer from "react-viewer";
import { ActionType } from "react-viewer/lib/Icon";

import ImageInput from "../../../common/ImageInput";
import BitcarSelectInput from "../../../common/Input";
import { activation_status_list } from "../../../../constants";
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
  // {
  //   key: "prev",
  //   actionType: _Icon.ActionType.prev
  // },
  {
    key: "reset",
    actionType: ActionType.reset
  },
  // {
  //   key: "next",
  //   actionType: _Icon.ActionType.next
  // },
  {
    key: "rotateLeft",
    actionType: ActionType.rotateLeft
  },
  {
    key: "rotateRight",
    actionType: ActionType.rotateRight
  }
  // {
  //   key: "scaleX",
  //   actionType: _Icon.ActionType.scaleX
  // },
  // {
  //   key: "scaleY",
  //   actionType: _Icon.ActionType.scaleY
  // },
  // {
  //   key: "download",
  //   actionType: _Icon.ActionType.download
  // }
];

const DriverInfoPresenter = ({
  data,
  isOpen,
  toggle,
  showImage,
  handleZoom,
  lockAccount,
  unLockAccount,
  updateAccount,
  deleteAccount,
  focusDate,
  onChangeDate,
  onChangeFocusDate,
  isUpdate,
  allowUpdate,
  onChangePicture,
  onChangePictureArr,
  onChangePictureReport,
  onChangeInputDocuments,
  onChangeInput,
  verifyDriver
}) => {
  if (!data) return null;
  const {
    driving_license,
    identity_card,
    psv_license,
    reports,
    vehicle,
    vehicle_insurance
  } = data.documents;
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
          {
            // <Modal isOpen={isOpen} toggle={toggle} className="light-box">
            //   <div>
            //     <button className="close-icon" onClick={toggle}>
            //       <h1>X</h1>
            //     </button>
            //   </div>
            //   <ModalBody>
            //     <img src={showImage} alt="img" />
            //   </ModalBody>
            // </Modal>
          }

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
                        {activation_status_list.map((item, id) => (
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
                      {!data.verified && 
                        <Button style={{marginLeft:10}} onClick={verifyDriver} color="primary">
                          Verify
                        </Button>
                      }
                      
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <i className="icon-map" /> Id Card
        </CardHeader>
        <CardBody>
          <Row>
            {[
              ["Front", "img_front_side_id", "image_front"],
              ["Back", "img_back_side_id", "image_back"]
            ].map(it => (
              <Col md="3" key={it[1]}>
                <p className="text-center">{it[0]}</p>
                <ImageInput
                  image={identity_card[it[2]]}
                  label={it[1]}
                  name={it[2]}
                  onChange={onChangePicture("identity_card")}
                  ratio="75%"
                  backgroundImg
                  handleZoom={handleZoom(identity_card[it[2]])}
                />
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <i className="icon-map" /> Car
        </CardHeader>
        <CardBody>
          <Row>
            {[
              ["Front", "img_front_vehicle"],
              ["Back", "img_back_vehicle"],
              ["Side view 1", "img_front_side_1"],
              ["Side view 2", "img_front_side_2"]
            ].map((item, idx) => (
              <Col md="3" key={idx}>
                <p className="text-center">{item[0]}</p>
                <ImageInput
                  image={vehicle.images[idx]}
                  label={item[1]}
                  onChange={onChangePictureArr("vehicle", idx)}
                  ratio="75%"
                  backgroundImg
                  handleZoom={handleZoom(vehicle.images[idx])}
                />
              </Col>
            ))}
          </Row>
          <Row>
            <Col md="6">
              <FormGroup row>
                <Label for="license_plate" sm={4}>
                  Card Plate No
                </Label>
                <Col sm={8}>
                  <Input
                    name="license_plate"
                    id="license_plate"
                    value={vehicle.license_plate}
                    onChange={onChangeInputDocuments("vehicle")}
                  />
                </Col>
                <Label />
              </FormGroup>
              <FormGroup row>
                <Label sm={4} htmlFor="color">
                  Car Colour
                </Label>
                <Col sm={8}>
                  <Input
                    name="color"
                    value={vehicle.color}
                    id="color"
                    onChange={onChangeInputDocuments("vehicle")}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup row>
                <Label sm={4} htmlFor="model">
                  Car Make & Model
                </Label>
                <Col sm={8}>
                  <Input
                    name="model"
                    value={vehicle.model}
                    id="model"
                    onChange={onChangeInputDocuments("vehicle")}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={4} htmlFor="capacity">
                  Passenger capacity
                </Label>
                <Col sm={8}>
                  <Input
                    type="number"
                    min="4"
                    name="capacity"
                    value={vehicle.capacity}
                    id="capacity"
                    onChange={onChangeInputDocuments("vehicle")}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <i className="icon-map" /> Driving License
        </CardHeader>
        <CardBody>
          <Row>
            {[
              ["Front", "img_front_driving", "image_front"],
              ["Back", "img_back_driving", "image_back"]
            ].map(it => (
              <Col md="3" key={it[1]}>
                <p className="text-center">{it[0]}</p>
                <ImageInput
                  image={driving_license[it[2]]}
                  label={it[1]}
                  name={it[2]}
                  onChange={onChangePicture("driving_license")}
                  ratio="75%"
                  backgroundImg
                  handleZoom={handleZoom(driving_license[it[2]])}
                />
              </Col>
            ))}
          </Row>
          <Row>
            <Col md="6">
              <FormGroup row>
                <Label for="state" sm={4}>
                  Driving State / Zone
                </Label>
                <Col sm={8}>
                  <Input
                    name="state"
                    value={driving_license.state}
                    id="state"
                    onChange={onChangeInputDocuments("driving_license")}
                  />
                </Col>
                <Label />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup row>
                <Label sm={5} htmlFor="driving_license_issue_date">
                  Driving License Exp Date
                </Label>
                <Col sm={7}>
                  <SingleDatePicker
                    // renderMonthElement={renderMonthElement}
                    isOutsideRange={() => false}
                    withPortal
                    numberOfMonths={1}
                    readOnly
                    date={moment(driving_license.issue_date)} // momentPropTypes.momentObj or null
                    onDateChange={onChangeDate("driving_license", "issue_date", "driving")} // PropTypes.func.isRequired
                    focused={focusDate.driving} // PropTypes.bool
                    onFocusChange={onChangeFocusDate("driving")} // PropTypes.func.isRequired
                    id="driving_license_issue_date" // PropTypes.string.isRequired,
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <i className="icon-map" /> Insurance
        </CardHeader>
        <CardBody>
          <Row>
            {[
              ["Front", "img_front_insu", "image_front"],
              ["Back", "img_back_insu", "image_back"]
            ].map(it => (
              <Col md="3" key={it[1]}>
                <p className="text-center">{it[0]}</p>
                <ImageInput
                  image={vehicle_insurance[it[2]]}
                  label={it[1]}
                  name={it[2]}
                  onChange={onChangePicture("vehicle_insurance")}
                  ratio="75%"
                  backgroundImg
                  handleZoom={handleZoom(vehicle_insurance[it[2]])}
                />
              </Col>
            ))}
          </Row>
          <Row>
            <Col md="6">
              <FormGroup row>
                <Label for="company" sm={4}>
                  Insurance Company
                </Label>
                <Col sm={8}>
                  <Input
                    name="company"
                    value={vehicle_insurance.company}
                    id="company"
                    onChange={onChangeInputDocuments("vehicle_insurance")}
                  />
                </Col>
                <Label />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup row>
                <Label sm={5} htmlFor="vehicle_insurance_expiry_date">
                  Insurance Exp Date
                </Label>
                <Col sm={7}>
                  <SingleDatePicker
                    isOutsideRange={() => false}
                    withPortal
                    numberOfMonths={1}
                    readOnly
                    date={moment(vehicle_insurance.expiry_date)} // momentPropTypes.momentObj or null
                    onDateChange={onChangeDate(
                      "vehicle_insurance",
                      "expiry_date",
                      "vehicle"
                    )} // PropTypes.func.isRequired
                    focused={focusDate.vehicle} // PropTypes.bool
                    onFocusChange={onChangeFocusDate("vehicle")} // PropTypes.func.isRequired
                    id="vehicle_insurance_expiry_date" // PropTypes.string.isRequired,
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <i className="icon-map" /> Report
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="3">
              <p className="text-center">Puskakom Report Front</p>
              <ImageInput
                image={reports.puskakom.image_front}
                label="img_front_side_pus"
                name="image_front"
                onChange={onChangePictureReport("puskakom")}
                ratio="75%"
                backgroundImg
                handleZoom={handleZoom(reports.puskakom.image_front)}
              />
            </Col>
            <Col md="3">
              <p className="text-center">Puskakom Report Back</p>
              <ImageInput
                image={reports.puskakom.image_back}
                label="img_back_side_pus"
                name="image_back"
                onChange={onChangePictureReport("puskakom")}
                ratio="75%"
                backgroundImg
                handleZoom={handleZoom(reports.puskakom.image_back)}
              />
            </Col>
            <Col md="3">
              <p className="text-center">Medical Report Front</p>
              <ImageInput
                image={reports.medical.image_front}
                label="img_front_side_medi"
                name="image_front"
                onChange={onChangePictureReport("medical")}
                ratio="75%"
                backgroundImg
                handleZoom={handleZoom(reports.medical.image_front)}
              />
            </Col>
            <Col md="3">
              <p className="text-center">Medical Report Back</p>
              <ImageInput
                image={reports.medical.image_back}
                label="img_back_side_medi"
                name="image_back"
                onChange={onChangePictureReport("medical")}
                ratio="75%"
                backgroundImg
                handleZoom={handleZoom(reports.medical.image_back)}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <i className="icon-map" /> PSV License
        </CardHeader>
        <CardBody>
          <Row>
            {[
              ["Front", "img_front_psv", "image_front"],
              ["Back", "img_back_psv", "image_back"]
            ].map(it => (
              <Col md="3" key={it[1]}>
                <p className="text-center">{it[0]}</p>
                <ImageInput
                  image={psv_license[it[2]]}
                  label={it[1]}
                  name={it[2]}
                  onChange={onChangePicture("psv_license")}
                  ratio="75%"
                  backgroundImg
                  handleZoom={handleZoom(psv_license[it[2]])}
                />
              </Col>
            ))}
          </Row>
          <Row>
            <Col md="6">
              <FormGroup row>
                <Label sm={4} htmlFor="psv_license_expiry_date">
                  PSV License Exp Date
                </Label>
                <Col sm={8}>
                  <SingleDatePicker
                    isOutsideRange={() => false}
                    withPortal
                    numberOfMonths={1}
                    readOnly
                    date={moment(psv_license.expiry_date)} // momentPropTypes.momentObj or null
                    onDateChange={onChangeDate("psv_license", "expiry_date","psv")} // PropTypes.func.isRequired
                    focused={focusDate.psv} // PropTypes.bool
                    onFocusChange={onChangeFocusDate("psv")} // PropTypes.func.isRequired
                    id="psv_license_expiry_date" // PropTypes.string.isRequired,
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button color="primary" onClick={updateAccount}>
                Save
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default DriverInfoPresenter;
