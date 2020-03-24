import React from 'react';
import {
	Container,
	Row,
	Col,
	CardGroup,
	Card,
	CardBody,
	Button,
	Input,
	InputGroup,
	InputGroupAddon,
	Form,
} from 'reactstrap';

export default function SetPasswordPresenter(props) {
	return (
		<div className="app flex-row align-items-center">
			<Container>
				<Row className="justify-content-center">
					<Col md="8">
						<CardGroup className="mb-4">
							<Card className="p-4">
								<CardBody>
									<Form onSubmit={props.onSetPassword}>
										<h1>Set Password</h1>
										<p className="text-muted">Change your Password</p>
										<InputGroup className="mb-4">
											<div className="input-group-prepend">
												<span className="input-group-text">
													<i className="icon-lock" />
												</span>
											</div>
											<Input
												type="password"
												placeholder="Enter New Password"
												name="newPassword"
												value={props.auth.password}
												onChange={props.onChangeInput}
												required
											/>
										</InputGroup>
										<InputGroup className="mb-4">
											<div className="input-group-prepend">
												<span className="input-group-text">
													<i className="icon-lock" />
												</span>
											</div>
											<Input
												type="password"
												placeholder="Re-enter New Password"
												name="reEnterNewpassword"
												value={props.auth.password}
												onChange={props.onChangeInput}
												required
											/>
										</InputGroup>
										<Row>
											<Col xs="6">
												<Button type="submit" color="primary" className="px-4">
													Submit
												</Button>
											</Col>
										</Row>
									</Form>
								</CardBody>
							</Card>
						</CardGroup>
					</Col>
				</Row>
			</Container>
		</div>
	);
}
