import React from 'react';

class Base extends React.Component {
  render() {
    return (
      <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>{this.props.title}</title>
            <link rel="shortcut icon" href="/static/images/favicon.png" />
            <link rel="stylesheet" href="/static/css/materialdesignicons.min.css" />
            <link rel="stylesheet" href="/static/css/style.css" />
            <link rel="stylesheet" href="/static/css/table.css" />
        </head>
        <body>
            {this.props.children}
            
            <script src="/static/js/material-components-web.min.js"></script>
            <script src="/static/js/jquery.min.js"></script>
            <script src="/static/js/Chart.min.js"></script>
            <script src="/static/js/progressbar.min.js"></script>
            <script src="/static/js/misc.js"></script>
            <script src="/static/js/material.js"></script>
            {this.props.script && <script src={`js/${this.props.script}.js`}></script>}
        </body>
      </html>
    );
  }
}

export default Base;