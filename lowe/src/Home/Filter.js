import { Component } from "react";
import "./Filter.css";
import ScrollContainer from 'react-indiana-drag-scroll'
import FilterModal from "./FilterModal";
import ModalFilter from './ModalFilter';

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "리뷰 많은 순",
            filter: false
        };
    }

    onClickFilter = () => {
        this.setState({filter: true})
    }
    onClickclose = () => {
        this.setState({filter: false})
    }

    onClickchangeFilter = (e) => () => {

        this.setState({status: e, filter: false})
    }


    render() {
        return (
            <>
                <div className="filter-promotion">
                    <p style={{lineHeight:"39px"}} className={(this.props.promotion ? "pull_button" : 'push_button')} onClick={this.props.onclickAll}>all</p>
                    <p style={{lineHeight:"39px"}} className={(this.props.promotion ? "push_button" : 'pull_button')} onClick={this.props.onclickPromotion}>event</p>
                </div>
                <ScrollContainer className="filter_category">
                        {this.props.category.map((e, i) => (
                            <span key={e.id} className={(this.props.categorySelect === e.id ? "category_select" : "category_nonselect")} onClick={this.props.onclickCategory(e.id)}>{e.category}</span>
                        ))
                        }
                </ScrollContainer>
                <div className="filter_recent">
                    <div onClick={this.props.onClickOpens}>
                        <img src={process.env.PUBLIC_URL + "/image/nav/filter.svg"} alt="로위 필터" />
                    </div>
                    <div onClick={this.props.onClickFilter}>
                        <span>{this.props.status}</span>
                        <img style={{verticalAlign: "middle"}} src={process.env.PUBLIC_URL + "/image/nav/filter_updown.svg"} alt="로위 필터" />

                    </div>
                </div>
                {
                    this.props.filter ?
                    <FilterModal status={this.props.status} close={this.props.onClickclose} onclickdataFilter={this.props.onclickdataFilter} /> : null
                }
                {
                this.props.modal ?
                    <ModalFilter 
                    close={this.props.onClickCloses} 
                    open={this.props.onClickOpens}
                    onclicklength={this.props.onclicklength} 
                    onclickgender={this.props.onclickgender}
                    onclicklocation={this.props.onclicklocation}
                    length={this.props.length} 
                    gender={this.props.gender} 
                    location={this.props.location} 
                    onclickReset={this.props.onclickReset}
                    onclicksearching={this.props.onclicksearching} />
                    : null
                }
            </>
        )
    }
}

export default Filter;