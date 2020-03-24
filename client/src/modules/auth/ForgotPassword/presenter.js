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
	Form,
} from 'reactstrap';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPresenter(props) {
	return (
		<div className="app flex-row align-items-center">
			<Container>
				<Row className="justify-content-center">
					<Col md="8">
						<CardGroup className="mb-4">
							<Card className="p-4">
								<CardBody>
									<Form onSubmit={props.onForgotPassword}>
										<h1>Forgot Password</h1>
										<p className="text-muted">Please Enter Your Email</p>
										<InputGroup className="mb-3">
											<div className="input-group-prepend">
												<span className="input-group-text">
													<i className="icon-user" />
												</span>
											</div>
											<Input
												type="text"
												placeholder="Email"
												name="email"
												value={props.auth.email}
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
											<Col xs="6" className="text-right">
												<Link to="/login">
													<Button type="reset" color="link" className="px-0">
														Back
													</Button>
												</Link>
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
