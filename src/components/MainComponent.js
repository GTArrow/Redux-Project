import React, { Component } from 'react';
import Menu from './MenuComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Dishdetail from './DishdetailComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import {Switch, Route,Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { postComment, fetchComments, fetchDishes, fetchPromos, fetchLeaders, postFeedback} from '../redux/ActionCreators';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapStateToProps = state=>{
    return {
      dishes:state.dishes,
      comments: state.comments,
      promotions: state.promotions,
      leaders: state.leaders
    }
}

const mapDispatchToProps = dispatch =>({
  postComment: (dishId,rating,author,comment)=>dispatch(postComment(dishId,rating,author,comment)),
  postFeedback: (feedback)=>dispatch(postFeedback(feedback)),
  fetchDishes: ()=> dispatch(fetchDishes()),
  fetchComments: ()=> dispatch(fetchComments()),
  fetchPromos: ()=> dispatch(fetchPromos()),
  fetchLeaders: ()=> dispatch(fetchLeaders()),
  resetFeedbackForm: ()=>{dispatch(actions.reset('feedback'))}
});

class Main extends Component {

  componentDidMount(){
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }

  render() {
    const DishwithId=({match})=>{
      return(
        <Dishdetail dish={this.props.dishes.dishes.filter((dish)=>dish.id===parseInt(match.params.dishid,10))[0]}
        dishesLoading={this.props.dishes.isLoading}
        dishesErrorMess = {this.props.dishes.errMess}
        comments={this.props.comments.comments.filter((comment)=>comment.dishId===parseInt(match.params.dishid,10))}
        commentsErrorMess = {this.props.comments.errMess}
        postComment={this.props.postComment}/>
      );
    }
    const HomePage= ()=>{
      return(
        <Home dish={this.props.dishes.dishes.filter((dish)=>dish.featured)[0]}
        dishesLoading={this.props.dishes.isLoading}
        dishesErrorMess = {this.props.dishes.errMess}
        promotion={this.props.promotions.promos.filter((promo)=>promo.featured)[0]}
        promosLoading={this.props.promotions.isLoading}
        promosErrorMess = {this.props.promotions.errMess}
        leader={this.props.leaders.leaders.filter((leader)=>leader.featured)[0]}
        leadersLoading={this.props.leaders.isLoading}
        leadersErrorMess = {this.props.leaders.errMess}/>
      );
    }
    const AboutUs=()=>{
      return(
        <About leaders={this.props.leaders.leaders}
        leadersLoading={this.props.leaders.isLoading}
        leadersErrorMess = {this.props.leaders.errMess}/>
      );
    }
    return (
      <div >
          <Header/>
          <TransitionGroup>
            <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
              <Switch>
                <Route path="/home" component={HomePage} />
                <Route exact path="/menu" component={()=><Menu dishes={this.props.dishes}/>} />
                <Route path="/menu/:dishid" component={DishwithId}/>
                <Route exact path="/contactus" component={()=><Contact postFeedback={this.props.postFeedback} resetFeedbackForm={this.props.resetFeedbackForm}/>} />
                <Route exact path="/aboutus" component={AboutUs} />
                <Redirect to="/home"></Redirect>
              </Switch>
            </CSSTransition>
          </TransitionGroup>
          <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Main));
