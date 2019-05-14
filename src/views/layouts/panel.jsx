import React, { Component } from 'react';
import Footer from './_footer';
import Header from './_header';
import Sidebar from './_sidebar';
import Base from './base';

export default class Panel extends Component {
    render() {
        return (
            <Base title={this.props.page.title || ''}>
                <div class="body-wrapper">
                    <Sidebar />
                    <Header />
                    <div class="page-wrapper mdc-toolbar-fixed-adjust">
                        <main class="content-wrapper">
                            <div class="mdc-layout-grid">
                                <div class="mdc-layout-grid__inner">
                                    {this.props.children}
                                </div>
                            </div>
                        </main>
                        <Footer />
                    </div>
                </div>
            </Base>
        )
    }
}
