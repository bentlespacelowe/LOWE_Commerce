import { Component } from "react";
import "./Review.css";
import axios from 'axios';
import Header from "../Sign/SignHeader";
import ReviewModal from "./ReviewModal";

class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: 0,
            id: 0,
            Color: 0,
            Amout: 0,
            Thick: 0,
            content: '',
            imgs: [],
            img: '',
            phonemodal: false,
            modalcomment: '',
            payment: "",

        };
    }

    openmodalReview = (e) => {
        this.setState({ phonemodal: true, modalcomment: e });
    };
    closemodalReview = () => {
        this.setState({ phonemodal: false, modalcomment: "" });
    };

    componentDidMount = () => {
        let id = window.location.pathname.split("/")[4];
        let ManagerId = window.location.pathname.split("/")[3];
        let user = window.localStorage.getItem("id");

        if (window.location.pathname.split("/")[5]) {

            if (window.location.pathname.split("/")[6]) {

                this.setState({ id: id, user: user, ManagerId: ManagerId, payment: window.location.pathname.split("/")[5], surgeryId: window.location.pathname.split("/")[6] })
            } else {

                this.setState({ id: id, user: user, ManagerId: ManagerId, payment: window.location.pathname.split("/")[5] })
            }
        } else {
            this.setState({ id: id, user: user, ManagerId: ManagerId, payment: "" })
        }
        let arr = [];
        if (this.props.location.state) {
            let img = this.props.location.state.Images;
            if (img.length) {
                for (let i = 0; i < img.length; i++) {
                    let data = {
                        url: img[i].url,
                    }
                    arr.push(data)
                }
            }
            this.setState({
                Color: Number(this.props.location.state.hair_color),
                Amout: Number(this.props.location.state.hair_amout),
                Thick: Number(this.props.location.state.hair_thick),
                content: this.props.location.state.content,
                imgs: arr
            })
        }
    }

    onClicksubmit = () => {
        const img = this.state.imgs;
        let boardid = window.location.pathname.split("/")[4];
        if (this.state.Color && this.state.Amout && this.state.Thick && this.state.content) {
            if (this.state.payment) {
                if (boardid !== "122") {
                    axios
                        .post("https://server.lowehair.kr/createReview", {
                            user: Number(this.state.user),
                            PaymentId: Number(this.state.payment),
                            BoardId: Number(boardid),
                            ManagerId: Number(this.state.ManagerId),
                            hair_color: this.state.Color,
                            hair_amout: this.state.Amout,
                            hair_thick: this.state.Thick,
                            content: this.state.content,
                            img,
                        })
                        .then((res) => {
                            this.openmodalReview("??????")
                        });
                } else {

                    axios
                        .post("https://server.lowehair.kr/createReview", {
                            user: Number(this.state.user),
                            PaymentId: Number(this.state.payment),
                            SurgeryId: Number(this.state.surgeryId),
                            BoardId: Number(this.state.id),
                            ManagerId: Number(this.state.ManagerId),
                            hair_color: this.state.Color,
                            hair_amout: this.state.Amout,
                            hair_thick: this.state.Thick,
                            content: this.state.content,
                            img,
                        })
                        .then((res) => {
                            this.openmodalReview("??????")
                        });
                }

            } else {
                axios
                    .post("https://server.lowehair.kr/createReview", {
                        user: Number(this.state.user),
                        BoardId: Number(this.state.id),
                        ManagerId: Number(this.state.ManagerId),
                        hair_color: this.state.Color,
                        hair_amout: this.state.Amout,
                        hair_thick: this.state.Thick,
                        content: this.state.content,
                        img
                    })
                    .then((res) => {
                        this.openmodalReview("??????")
                    });
            }
        } else {
            this.openmodalReview("?????? ????????? ???????????????")
        }
    }

    onClickEdit = () => {
        const img = this.state.imgs
        if (this.state.Color && this.state.Amout && this.state.Thick && this.state.content) {
            axios
                .post("https://server.lowehair.kr/updateReview", {
                    id: this.props.location.state.id,
                    hair_color: this.state.Color,
                    hair_amout: this.state.Amout,
                    hair_thick: this.state.Thick,
                    content: this.state.content,
                    img
                })
                .then((res) => {
                    this.openmodalReview("?????? ?????? ??????\n????????? ????????? ????????????????????? ?????? ??? ??? ????????? : )")
                });
        } else {
            this.openmodalReview("?????? ????????? ???????????????")
        }
    }

    handleInputValue = (key) => async (e) => {
        if (key === "img") {
            let reader = new FileReader();
            let file = e.target.files[0];
            if (e.target.files.length) {
                reader.onloadend = () => {
                    this.setState({
                        file: file,
                        previewURL: reader.result,
                    });
                };
                reader.readAsDataURL(file);
                let img = e.target.files[0];

                const formData = new FormData();
                formData.append("file", img);
                await axios
                    .post("https://server.lowehair.kr/addImg", formData, {
                        headers: {
                            "content-type": "multipart/form-data",
                        },
                    }).then(res => {
                        let img = this.state.imgs;
                        let data = {
                            url: res.data.url,
                        }
                        img.push(data);
                        this.setState({ imgs: img });
                    })
            }
        } else {
            this.setState({ [key]: e.target.value });
        }
    };


    onclickColor = (e) => () => {
        this.setState({ Color: e })
    }


    onclickAmount = (e) => () => {
        this.setState({ Amout: e })
    }

    onclickThick = (e) => () => {
        this.setState({ Thick: e })
    }



    onClickDelimg = (i) => () => {
        let img = this.state.imgs;
        img.splice(i, 1);
        this.setState({ imgs: img });
    }

    render() {
        let content = this.props.location.state
        return (
            <>
                <Header header="????????????" />
                <section className="review_write_section">
                    <div>
                        <div className="review_write_title">????????? ?????? ????????????????</div>
                        <div className="review_write-filter">
                            <p className={(this.state.Color === 1 ? "click_button" : 'unclick_button')} onClick={this.onclickColor(1)}>????????????</p>
                            <p className={(this.state.Color === 2 ? "click_button" : 'unclick_button')} onClick={this.onclickColor(2)}>????????????</p>
                        </div>
                    </div>
                    <div>
                        <div className="review_write_title">????????? ????????????????</div>
                        <div className="review_write-filter">
                            <p className={(this.state.Amout === 1 ? "click_button" : 'unclick_button')} onClick={this.onclickAmount(1)}>??? ??????</p>
                            <p className={(this.state.Amout === 2 ? "click_button" : 'unclick_button')} onClick={this.onclickAmount(2)}>??? ??????</p>
                            <p className={(this.state.Amout === 3 ? "click_button" : 'unclick_button')} onClick={this.onclickAmount(3)}>??? ??????</p>
                        </div>
                    </div>
                    <div>
                        <div className="review_write_title">????????? ????????????????</div>
                        <div className="review_write-filter">
                            <p className={(this.state.Thick === 1 ? "click_button" : 'unclick_button')} onClick={this.onclickThick(1)}>??????</p>
                            <p className={(this.state.Thick === 2 ? "click_button" : 'unclick_button')} onClick={this.onclickThick(2)}>?????????</p>
                            <p className={(this.state.Thick === 3 ? "click_button" : 'unclick_button')} onClick={this.onclickThick(3)}>??????</p>
                        </div>
                    </div>

                    <div>
                        <div className="review_write_title">????????? ????????? ????????????.</div>
                        <textarea
                            onChange={this.handleInputValue("content")}
                            placeholder="?????? ????????? ??????????????? ?????? ????????????????????? ????????? ??????!"
                        >
                            {content ? this.props.location.state.content : null}
                        </textarea>
                    </div>
                    <div className="reviewimg_scroll">

                        <div>
                            <label htmlFor="reviewimg"><div><div style={{ fontSize: "30px", fontWeight: "400", marginTop: "15px", height: "30px" }}>+</div>{this.state.imgs.length} / 5</div></label>
                            {this.state.imgs.length < 5 ?
                                <input
                                    type="file"
                                    accept="image/*"
                                    size="40"
                                    id="reviewimg"
                                    onChange={this.handleInputValue("img")}
                                /> : null
                            }
                        </div>
                        {
                            this.state.imgs.length ?
                                this.state.imgs.map((e, i) => (
                                    <div key={i}>
                                        <img className="review_write_addimg" src={e.url} alt={e.url}></img>
                                        <img className="review_write_delimg" onClick={this.onClickDelimg(i)} src={process.env.PUBLIC_URL + "/image/nav/reviewimg_del.svg"} alt="?????? ????????? ??????" />
                                    </div>
                                )) : null
                        }
                    </div>
                    {
                        this.props.location.state ?
                            <div className="review_write_submit" style={{ marginLeft: 0 }} onClick={this.onClickEdit}>?????? ??????</div> :
                            <div className="review_write_submit" style={{ marginLeft: 0 }} onClick={this.onClicksubmit}>?????? ??????</div>
                    }
                </section>
                <ReviewModal open={this.state.phonemodal} closemodal={this.closemodalReview} comment={this.state.modalcomment} />
            </>
        )
    }
}

export default Review;
