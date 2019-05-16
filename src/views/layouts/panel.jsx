import React, { Component } from 'react';
import Footer from './_footer';
import Header from './_header';
import Sidebar from './_sidebar';
import Base from './base';


const defaultItems = [
    {
        title: "users",
        icon: "perm_identity",
        link: "/admin/users"
    }
]

export default class Panel extends Component {
    render() {
        return (
            <Base title={this.props.page.title || ''}>
                <div class="body-wrapper">
                    <Sidebar items={this.props.sidebar.items} />
                    <Header />
                    <div class="page-wrapper mdc-toolbar-fixed-adjust">
                        <main class="content-wrapper">
                            {this.props.children}
                        </main>
                        <Footer />
                    </div>
                </div>
            </Base>
        )
    }
}
