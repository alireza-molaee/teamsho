import React from 'react'

export default function Sidebar(props) {

    const listItems =  props.items.map((item, index) => {
        return (
            <div key={`drawer-item-${index}`} class="mdc-list-item mdc-drawer-item">
                <a class="mdc-drawer-link" href={item.link}>
                    <i class="material-icons mdc-list-item__start-detail mdc-drawer-item-icon" aria-hidden="true">{item.icon}</i>
                    <span>{item.title}</span>
                </a>
            </div>
        )
    })

    return (
        <aside class="mdc-persistent-drawer mdc-persistent-drawer--open">
            <nav class="mdc-persistent-drawer__drawer">
                <div class="mdc-persistent-drawer__toolbar-spacer">
                    <a href="index.html" class="brand-logo" style={{width: 'auto'}}>
                        <img src="/static/images/logo.svg" alt="logo" style={{
                                height: '40px',
                                width: 'auto'
                        }} />
                    </a>
                    <h1 style={{fontSize: '1.3em', marginBottom: '-6px', marginLeft: '13px'}}>Admin Panel</h1>
                </div>
                <div class="mdc-list-group">
                    <nav class="mdc-list mdc-drawer-menu">
                        {listItems}

                        {/* <div class="mdc-list-item mdc-drawer-item" href="#" data-toggle="expansionPanel" target-panel="ui-sub-menu">
                            <a class="mdc-drawer-link" href="#">
                                <i class="material-icons mdc-list-item__start-detail mdc-drawer-item-icon" aria-hidden="true">dashboard</i>
                                UI Features
                                <i class="mdc-drawer-arrow material-icons">arrow_drop_down</i>
                            </a>
                            <div class="mdc-expansion-panel" id="ui-sub-menu">
                                <nav class="mdc-list mdc-drawer-submenu">
                                    <div class="mdc-list-item mdc-drawer-item">
                                        <a class="mdc-drawer-link" href="pages/ui-features/buttons.html">
                                            Buttons
                                        </a>
                                    </div>
                                    <div class="mdc-list-item mdc-drawer-item">
                                        <a class="mdc-drawer-link" href="pages/ui-features/typography.html">
                                            Typography
                                        </a>
                                    </div>
                                </nav>
                            </div>
                        </div> */}

                        {/* <div class="mdc-list-item mdc-drawer-item purchase-link">
                            <a href="https://www.bootstrapdash.com/product/material-admin/" target="_blank" class="mdc-button mdc-button--raised mdc-button--dense mdc-drawer-link" data-mdc-auto-init="MDCRipple">
                                Upgrade To Pro
                            </a>
                        </div> */}
                    </nav>
                </div>
            </nav>
        </aside>
    )
}
