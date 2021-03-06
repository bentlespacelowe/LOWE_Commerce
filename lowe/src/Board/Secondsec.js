import { Component } from "react";
import axios from "axios";
import "./Secondsec.css"
import DesignerList from "../Designer/DesignerList";
import Fifthsec from "./Fifthsec";

class Secondsec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            like: false,
            banner: '',
            designer: []
        };
        this.onclickLike = this.onclickLike.bind(this);
    }

    componentDidMount = () => {
        let id = this.props.data.board.id;
        let user = Number(window.localStorage.getItem("id"));
        if (id && user) {
            axios.post("https://server.lowehair.kr/boardLikeChk", {
                user: user,
                id: id,
            })
                .then((res) => {
                    if (res.data.heart === 1) {
                        this.setState({ like: true })
                    } else {
                        this.setState({ like: false })
                    }
                });
        }


        axios.post("https://server.lowehair.kr/getAllBanner", {})
            .then((res) => {
                if (res.data.length) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].type === 2 && this.props.data.board.eventType === 1) {
                            this.setState({ banner: res.data[i] })
                        } else if (res.data[i].type === 3 && this.props.data.board.eventType === 0) {
                            this.setState({ banner: res.data[i] })
                        }
                    }
                }
            }).catch((err) => {
                console.log(err)
            })

        this.setState({ designer: this.props.designer[0] })
    }


    async onclickLike(e) {
        e.preventDefault();
        let id = this.props.data.board.id;
        let user = window.localStorage.getItem("id");
        let like = 0;
        if (this.state.like) {
            like = 1;
        } else {
            like = 0;
        }
        if (id && user) {
            await axios.post("https://server.lowehair.kr/boardLikeUpdate", {
                id: id,
                user: user,
                heart: like
            }).then((res) => {
                this.setState({ like: !this.state.like })
            });
        }
    }

    handleShare = () => {
        let url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: '?????? - ??????????????? ?????????',
                text: '????????? ??????????????? ?????????. ?????? ????????? ?????? ??????????????? ?????? ???????????? ??? ??????, ??????(LOWE)',
                url: url,
            });
        }else{
            navigator.clipboard.writeText(url)
            .then(() => {
                alert("???????????? ?????? ????????? ???????????????!");
            })
        }
      }

      onClickReserve = () => {
        let id = window.location.pathname.split("/")[2];
        let userid = Number(window.localStorage.getItem("id"));
        let funnel = "";
        if (window.location.href.split("?")[1]) {
            funnel = "?" + window.location.href.split("?")[1];
        } else {
            funnel = '/'
        }

        if (userid) {
            axios.post("https://server.lowehair.kr/click", {
                type: 7,
                BoardId: id,
                ManagerId: this.props.data.board.ManagerId,
                UserId: userid,
                funnel: funnel,
                tab_num: 3
            })
                .then((res) => {
                    window.location.href = this.props.designer.reserve_url
                }).catch((err) => {
                });
        } else {
            axios.post("https://server.lowehair.kr/click", {
                type: 7,
                BoardId: id,
                ManagerId: this.props.data.board.ManagerId,
                funnel: funnel,
                tab_num: 3
            })
                .then((res) => {
                    window.location.href = this.props.designer.reserve_url
                }).catch((err) => {
                });
        }

    }



    render() {
        let user = window.localStorage.getItem("id");
        let funnel ="";
        if(window.location.href.split("?")[1]){
            funnel="?" + window.location.href.split("?")[1];
        } else{
            funnel=''
        }
        return (
            <section className="Board_second">
                <div className="Board_second_section">
                    <div className="Board_title">{this.props.data.board.name}</div>
                    <div className="Board_content">{this.props.data.board.content}</div>
                    { this.props.data.board.eventType ?
                        <div className="Board_real_price">{(Math.round(this.props.data.board.price / (100-this.props.data.board.eventPrice)*100 / 1000)*1000).comma()}???</div> :
                        <div className="Board_real_price"> </div>
                    }
                    <div className="Board_second_price">
                        <div className="Board_price" >
                            {this.props.data.board.eventType ?
                                <span className="Board_price_percent">{this.props.data.board.eventPrice}%</span> :
                                <></>
                            }
                            <span className="Board_price_price">{this.props.data.board.price.comma()}???</span>
                        </div>
                        <div>
                            {user ?
                                this.state.like === false ?
                                    <img src={process.env.PUBLIC_URL + "/image/nav/goods_dislike2.svg"} className="Board_like" alt="?????? ?????? ???" onClick={this.onclickLike} /> :
                                    <img src={process.env.PUBLIC_URL + "/image/nav/goods_like2.svg"} className="Board_like" alt="?????? ?????? ???" onClick={this.onclickLike} /> :
                                <img src={process.env.PUBLIC_URL + "/image/nav/goods_dislike2.svg"} className="Board_like" alt="?????? ?????? ???" onClick={() => { alert("???????????? ????????????") }} />
                            }
                            <img onClick={this.handleShare} src={process.env.PUBLIC_URL + "/image/nav/board_share.svg"} className="Board_share" alt="?????? ?????? ???" /> 
                        </div>
                    </div>
                    <div className="Board_second_addprice">
                        <div style={{ width: "80px", fontWeight: "700" }}>????????????</div>
                        <div style={{ width: "67%", maxWidth: "270px", whiteSpace: "pre-line" }}>{this.props.data.board.addPrice}</div>
                    </div>
                    <div className="Board_second_naver">
                        <div>
                            <img src={process.env.PUBLIC_URL + "/image/nav/board_naver.svg"} alt="?????????" />
                            <div onClick={this.onClickReserve}><span>????????? ????????????</span></div>
                        </div>
                    </div>
                    <div>
                        {this.props.designer ?
                            <DesignerList data={this.props.designer} board={true} /> 
                            : null
                        }
                    </div>
                </div>
                <Fifthsec data={this.props.data} top={true} />
                <a href={this.state.banner.url + funnel} className="Board_banner">
                    <img src={this.state.banner.img} alt="????????? ??????" />
                </a>
                <div id="filter_trigger" />
            </section>
        )
    }
}

export default Secondsec;