function downloadCallback() {
	scrollThrough();
}

function fileLoadCallback() {
	var canvas = document.getElementById( "c2" );

	var dims = nifti2.getDims();
	canvas.width = dims.nx;
	canvas.height = dims.nz;
	
	var ctx = canvas.getContext("2d");
	var imageData = ctx.getImageData( 0, 0, dims.nx, dims.nz );
	
	var slice = nifti2.getImage( "coronal", 40 );
	for( var i = 0; i < imageData.data.length; ++i )
	{
		imageData.data[i] = slice.data[i];

	}
	
	ctx.putImageData( imageData, 0,0 );
}


var counter = 0;

function scrollThrough()
{
	var canvas = document.getElementById( "c1" );

	var dims = nifti.getDims();

	canvas.width = dims.nx;
	canvas.height = dims.nz;
	var ctx = canvas.getContext("2d");
	var imageData = ctx.getImageData( 0, 0, dims.nx, dims.nz );
	
	var slice = nifti.getImage( "coronal", counter++ );
	
	for( var i = 0; i < imageData.data.length; ++i )
	{
		imageData.data[i] = slice.data[i];

	}
	
	ctx.putImageData( imageData, 0,0 );
	
	/*
	var url = canvas.toDataURL();
    var newImg = document.getElementById( "img1" );
    newImg.src = url;
	newImg.height = dims.nx * 3;
	 */
	
	if ( counter >= dims.ny )
	{
		counter = 0;
	}
	
	window.setTimeout( scrollThrough, 100 );
}

function loadFileFromDisk(e) 
{
	console.log( "loadFileFromDisk()" );
	var file = e.target.files[0];
	if (!file) {
		return;
	}
	
	nifti2 = new Nifti();
	nifti2.loadFile( file, fileLoadCallback );
}

function saveFile()
{
	if ( nifti ) {
		var filename = $("#input-fileName").val()
		var arrayBuffer = nifti.getRawData();
		var blob = new Blob([arrayBuffer], {type: 'application/octet-binary'} );
		saveAs( blob, filename );
	}
}

function invert() 
{
	var dims = nifti.getDims();
	for( var z = 0; z < dims.nz; ++z )
		for( var y = 0; y < dims.ny; ++y )
			for( var x = 0; x < dims.nx; ++x ) {
				var val = nifti.getValue( x, y, z );
				nifti.setValue( x, y, z, 255 - val );
			}
}

var nifti;
var nifti2;

function downloadFile()
{
	console.log( "downloadFile()" );
	nifti = new Nifti();
	nifti.download( "t1.nii", downloadCallback );
}

$(document).ready(function(){
	document.getElementById('buttonDownload').addEventListener('click', downloadFile, false);
	document.getElementById('buttonSave').addEventListener('click', saveFile, false);
	document.getElementById('file-input').addEventListener('change', loadFileFromDisk, false);
	document.getElementById('buttonInvert').addEventListener('click', invert, false);
});
