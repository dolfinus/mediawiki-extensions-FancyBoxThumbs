<?php

class FancyBoxThumb{

 public static function fbtBeforePageDisplay(&$out){
	global $fbtFancyBoxOptions;
	$out->addInlineScript('var fbtFancyBoxOptions = '.$fbtFancyBoxOptions.';');
	$out->addModules( 'ext.FancyBoxThumbs' );
	return true;
}

}
