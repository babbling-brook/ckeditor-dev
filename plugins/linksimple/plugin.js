/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';
( function() {
    CKEDITOR.plugins.add( 'linksimple', {
        icons: 'linksimple,unlinksimple',
        init: function( editor ) {
            editor.addCommand( 'linksimple', new CKEDITOR.dialogCommand( 'linksimpleDialog' ) );
            editor.addCommand( 'unlinksimple', new CKEDITOR.unlinksimpleCommand() );

            editor.ui.addButton( 'LinkSimple', {
                label: 'Link',
                command: 'linksimple',
                toolbar: 'insert'
            });
            editor.ui.addButton( 'UnlinkSimple', {
                label: 'Unlink',
                command: 'unlinksimple',
                toolbar: 'insert'
            });

            CKEDITOR.dialog.add( 'linksimpleDialog', this.path + 'dialogs/linksimple.js' );

			editor.on( 'doubleclick', function( evt ) {
				var element = CKEDITOR.plugins.linksimple.getSelectedLink( editor ) || evt.data.element;
				if ( !element.isReadOnly() ) {
					if ( element.is( 'a' ) ) {
                        evt.data.dialog = 'linksimpleDialog';
						// Pass the link to be selected along with event data.
						evt.data.link = element;
					}
				}
			}, null, null, 0 );
			editor.on( 'doubleclick', function( evt ) {

				if ( evt.data.dialog in { link: 1 } && evt.data.link ) {
					editor.getSelection().selectElement( evt.data.link );
                }
			}, null, null, 20 );
        }
    });

    /**
	 * Set of Link plugin helpers.
	 *
	 * @class
	 * @singleton
	 */
	CKEDITOR.plugins.linksimple = {
		/**
		 * Get the surrounding link element of the current selection.
		 *
		 *		CKEDITOR.plugins.link.getSelectedLink( editor );
		 *
		 *		// The following selections will all return the link element.
		 *
		 *		<a href="#">li^nk</a>
		 *		<a href="#">[link]</a>
		 *		text[<a href="#">link]</a>
		 *		<a href="#">li[nk</a>]
		 *		[<b><a href="#">li]nk</a></b>]
		 *		[<a href="#"><b>li]nk</b></a>
		 *
		 * @since 3.2.1
		 * @param {CKEDITOR.editor} editor
		 */
		getSelectedLink: function( editor ) {
			var selection = editor.getSelection();
			var selectedElement = selection.getSelectedElement();
			if ( selectedElement && selectedElement.is( 'a' ) )
				return selectedElement;

			var range = selection.getRanges()[ 0 ];

			if ( range ) {
				range.shrink( CKEDITOR.SHRINK_TEXT );
				return editor.elementPath( range.getCommonAncestor() ).contains( 'a', 1 );
			}
			return null;
		}
    };

	CKEDITOR.unlinksimpleCommand = function() {};
	CKEDITOR.unlinksimpleCommand.prototype = {
		exec: function( editor ) {
			var style = new CKEDITOR.style( { element: 'a', type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1 } );
			editor.removeStyle( style );
		},

		refresh: function( editor, path ) {
			// Despite our initial hope, document.queryCommandEnabled() does not work
			// for this in Firefox. So we must detect the state by element paths.

			var element = path.lastElement && path.lastElement.getAscendant( 'a', true );

			if ( element && element.getName() == 'a' && element.getAttribute( 'href' ) && element.getChildCount() )
				this.setState( CKEDITOR.TRISTATE_OFF );
			else
				this.setState( CKEDITOR.TRISTATE_DISABLED );
		},

		contextSensitive: 1,
		startDisabled: 1,
		requiredContent: 'a[href]'
	};

} )();