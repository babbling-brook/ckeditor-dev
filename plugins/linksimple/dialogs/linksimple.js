/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {
    CKEDITOR.dialog.add( 'linksimpleDialog', function ( editor ) {
        return {
            title: 'Link',
            minWidth: 400,
            minHeight: 200,

            contents: [
                {
                    id: 'tab-basic',
                    label: 'Enter link details',
                    elements: [
                        {
                            type: 'text',
                            id: 'linktext',
                            label: 'Link text',
                            validate: CKEDITOR.dialog.validate.notEmpty( "Link text field cannot be empty." ),
                            setup: function(element) {
                                this.setValue(element.getText());
                            },
                            commit: function( element ) {
                                element.setText( this.getValue() );
                            }
                        },
                        {
                            type: 'text',
                            id: 'url',
                            label: 'URL',
                            validate: CKEDITOR.dialog.validate.notEmpty( "URL field cannot be empty." ),
                            setup: function(element) {
                                this.setValue( element.getAttribute( "href" ) );
                            },
                            commit: function( element ) {

                                var url = this.getValue();
                                if (url.substr(0,7) !== 'http://' && url.substr(0,8) !== 'https://' && url.substr(0,7) !== 'ftp://') {
                                    url = 'http://' + url;
                                }
                                element.setAttribute( "href", url);
                            }
                        }
                    ]
                }
            ],
            onShow: function () {
                var selection = editor.getSelection();
                var element = selection.getStartElement();

                if ( element ) {
                    element = element.getAscendant( 'a', true );
                }

                if ( !element || element.getName() !== 'a' ) {
                    var selected_text = selection.getSelectedText();
                    element = editor.document.createElement( 'a' );
                    element.setText( selected_text );
                    this.insertMode = true;
                } else {
                    this.insertMode = false;
                }

                this.element = element;
                this.setupContent( this.element );
            },
            onOk: function() {
                var dialog = this;
                var link = dialog.element;

                dialog.commitContent( link );

                if ( dialog.insertMode ) {
                    editor.insertElement( link );
                }
            }
        };
    });
} )();
