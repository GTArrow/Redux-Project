import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Row,Col,Label,Modal, Button,ModalBody,ModalHeader, Card,CardImg,CardText,CardBody,CardTitle,Breadcrumb,BreadcrumbItem} from 'reactstrap';
import {Control,Errors,LocalForm} from 'react-redux-form';
import {Loading} from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger} from 'react-animation-components';

class CommentForm extends Component{
    constructor(props){
        super(props);
        this.state={
            modal:false
        };
    }
    toggle=()=>{
        this.setState({
            modal:!this.state.modal
        })
    }
    handleSubmit=(values)=>{
        this.toggle();
        this.props.postComment(this.props.dishId,values.rating,values.author,values.comment);
    }
    isRequired=(val)=> val && val.length;
    minLength=(len)=>(val)=> val && (val.length>=len);
    maxLength=(len)=>(val)=> !(val) || (val.length<len);

    render(){
        return(
            <div >
                <Button outline color="secondary" onClick={this.toggle}>
                    <span className="fa fa-pencil fa-sm">
                    &nbsp;Submit Comment</span>
                </Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values)=>this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" md={12}>Rating</Label>
                                <Col md={12}>
                                    <Control.select model=".rating" className="form-control" id="rating" name="rating" >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="author" md={12}>Your Name</Label>
                                <Col md={12}>
                                    <Control.text model=".author" className="form-control" id="author" name="author" placeholder="Your Name" validators={{required: this.isRequired, minLength: this.minLength(3), maxLength:this.maxLength(15)}}/>
                                    <Errors model=".author" messages={{
                                        required:"Required",
                                        minLength:"Minimum length is 3 characters",
                                        maxLength:"Maximum length is 15 characters"
                                    }} wrapper="ul" component="li" show="touched" className="text-danger" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" md={12}>Comment</Label>
                                <Col md={12}>
                                    <Control.textarea model=".comment" className="form-control" id="comment" name="comment" rows="5"/>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={12}>
                                    <Button type="submit" color="primary">
                                    Sumbmit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

    function RenderComments({comments,postComment,dishId,errMess}){
        if(errMess){
            return(
                <div className="container">
                    <div className="row">
                        <h4>{errMess}</h4>
                    </div>
                </div>  
            );
        }else if(comments != null){
            return(
                <div className="col-12 col-md-5 m-1">
                    <h4>Comments</h4>
                    <ul className="list-unstyled">
                        <Stagger in>
                            {comments.map((comment)=>{
                                return(
                                    <Fade in>
                                    <li key={comment.id}>
                                        <p>{comment.comment}</p>
                                    <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US',{year:'numeric',month:'short',day:'2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                                    </li>
                                    </Fade>
                                );
                            })}
                        </Stagger>
                    </ul>
                    <CommentForm dishId={dishId} postComment={postComment}/>
                </div>
            );
        }else{
            return(
                <div></div>
            );
        }
    }
function RenderDish({dish}){
            return(
                    <div className="col-12 col-md-5 m-1">
                        <FadeTransform in
                            transformProps={{
                                exitTransform:'scale(0.5) translateY(-50%)'
                            }}>
                            <Card>
                                <CardImg width="100%" object src={baseUrl+dish.image} alt={dish.name} />
                                <CardBody>
                                    <CardTitle>
                                        {dish.name}
                                    </CardTitle>
                                    <CardText>
                                        {dish.description}
                                    </CardText>
                                </CardBody>
                            </Card>
                        </FadeTransform>
                    </div>
            );
        }

const Dishdetail=(props)=>{
    if(props.dishesLoading){
        return (
            <div className="container">
                <div className="row">
                    <Loading/>
                </div>
            </div>
        );
    }else if (props.dishesErrorMess){
        return(
            <div className="container">
                <div className="row">
                    <h4>{props.dishesErrorMess}</h4>
                </div>
            </div>  
        );
    }
    else if(props.dish!=null){
        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <RenderDish dish={props.dish} />
                    <RenderComments comments={props.comments} 
                        postComment={props.postComment}
                        errMess = {props.commentsErrorMess}
                        dishId={props.dish.id}/>
                </div>
            </div>
        );
    }else{
        return(
            <div></div>
        );
    }
}
export default Dishdetail;