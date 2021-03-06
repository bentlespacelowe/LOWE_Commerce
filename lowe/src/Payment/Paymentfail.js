import { Component } from "react";
import Header from "../Sign/SignHeader";
import Footer from "../Nav/Footer";
import "./Paymentfail.css"

class Paymentfail extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = () => {
        let funnel ="";
        if(window.location.href.split("?")[1]){
            funnel="?" + window.location.href.split("?")[1];
        } else{
            funnel=''
        }
        let recent_payment = JSON.parse(window.localStorage.getItem("recent_payment"));
        this.setState({ data: recent_payment })
        setTimeout(() => {
            let id = this.state.data.boardId;
            window.location.href = `/board/${id}${funnel}`
        }, 5000);
    }



    render() {
        return (
            <>
                <Header header="결제실패" />
                <section className="Payment_fail_section">
                <img src={process.env.PUBLIC_URL + "/image/nav/exclamation_circle.svg"} alt="moreview" />
                    <div>결제 취소 / 실패 하셨습니다.</div>
                    <div>5초 후에 페이지가 이동합니다</div>
                </section>
                <Footer />
            </>
        );
    }
}

export default Paymentfail;