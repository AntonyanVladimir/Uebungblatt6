"use strict"
	function createArticle(article) {
		// Artikelinhalt zusammenbauen
		
		var $newArticle = $(`<article id=${article.id}><h2><a href="artikel.html?id=${article.id}"> ${article.ueberschrift} </a></h2>
		<p> ${article.datum}  Uhr von  ${article.autor} </p> 
		<p><b> ${article.anriss} </b></p></article>`);
	
		if(article.bild){
			$newArticle.append($(`<div><img src=${article.bild}></div>`))
		}
		
		for (var i = 0; i < article.tags.length; i++) {
			$newArticle.append($(`<a class="badge badge-pill badge-primary" href=${getEncodedUri(article.tags[i])}> ${article.tags[i]} </a> `));
		}
		
		// Text
		$newArticle.append($(`<p>${article.text}</p>`));
		// Tags einfügen
		// Social Media
		$newArticle.append($(`<div>
		<a title="Facebook" href="https://www.facebook.com/share.php?u=artikel.html?id=${article.id}" target="_blank">Teilen auf Facebook</a> | 
		<a title="Twitter" href="https://twitter.com/intent/tweet?url=artikel.html?id=${article.id}" target="_blank">Twittern</a> | 
		<a href="teilenEmail.html?id=${article.id}">Teilen via E-Mail</a> 
		</div>`));
		$newArticle.append($(`<a type="button" class="btn btn-warning" href="artikelNeu.html?id=${article.id}">Edit Article</a>`))
		return $newArticle;
	};
	
function getEncodedUri(tag){
	let uri = `tagliste.html?tag=${tag}`;
	return encodeURI(uri);
}
// <a href="https://www.facebook.com/sharer/sharer.php?u=example.org" target="_blank"></a>
/**
 * Erzeugt das DOM-Objekt für die $Sidebar. Hängt das Objekt NICHT ins DOM ein.
 * @param articles Array mit Artikel-Objekten
 * @returns DOM-Objekt mit der $Sidebar (<aside>...)
 */
function createSidebar(articles) {
	// Login-Formular
	var $sidebar = $(`<div class="row">
	<label for="login" class="col-6">Login</label> <input class="col-6" id="login" name="login" type="text" size="12" /><br>
	<label for="password" class="col-6">Passwort</label> <input class="col-6" id="password" name="password" type="text" size="12" /><br>
	<div class="col-12"><a class="btn btn-outline-primary btn-sm" href="#">Login</a></div>
	<div>`)
	
	
	 //Suchformular
	$sidebar.append($(`<hr class="col-12"><div class="col-12 input-group input-group-sm pr-0">
	<input id="searchquery" name="searchquery" type="text" class="form-control" aria-label="Suchen">
	<div class="input-group-append">
	<a id="searchBtn" class="btn btn-outline-primary">Suchen</a>
	</div>
	</div>`)) 
		
	
	// // Monatsliste
	$sidebar.append($(`<hr class="col-12">
	<ul class="list-group list-group-flush">
	<li class="list-group-item"><a href="monatsliste.html">November 2017 (3)</a></li>
	<li class="list-group-item"><a href="monatsliste.html">Dezember 2017 (1)</a></li>
	<li class="list-group-item"><a href="monatsliste.html">März 2018 (2)</a></li>
	<li class="list-group-item"><a href="monatsliste.html">April 2018 (1)</a></li>
	</ul>`))

	 // $Tagcloud
	$sidebar.append(createTagCloud(articles)); 
	
	return $sidebar;	
};



/**
 * Erzeugt das HTML für die $Tagcloud. Hängt KEIN DOM-Objekt ins DOM ein.
 * @param articles Array mit den Blogartikeln
 * @returns String mit dem HTML-Markup der $Tagcloud
 */
function createTagCloud(articles) {
	// Alle Artikel durchgehen und alle Tags aufsammeln. Für die Schriftgrößen
	// benötigen wir für jedes Tag die Anzahl des Vorkommens über alle Artikel.
	// Je häufiger ein Tag vorkommt, desto größer soll es dargestellt werden.
	// Als Speicher für diese Daten bietet sich eine Map an, ein Objekt, das
	// Schlüssel-/Wert-Paare enthält. Die Schlüssel sind die Tags und die Werte
	// sind deren Häufigkeiten: {Tag1: Anzahl1, Tag2: Anzahl2, ...}
	
	// leeres Objekt anlegen
	var tagMap = {};
	
	// größte Häufigkeit eines Tags
	var max = 1;
	
	// Alle Artikel durchlaufen
	for (var i = 0; i < articles.length; i++) {
		var a = articles[i];
		
		// Alle Tags des Artikels durchlaufen
		for (var j = 0; j < a.tags.length; j++) {
			var tag = a.tags[j];
			// Testen, ob das Tag schon in der Map ist
			if (!(tag in tagMap)) {
				// Nein, taucht zum ersten Mal auf
				// --> mit Anzahl 1 in die Map schreiben
				tagMap[tag] = 1;
			} else {
				// war schon da, Anzahl erhöhen
				tagMap[tag]++;
				// Maximum ggf. anpassen
				if (tagMap[tag] > max) {
					max = tagMap[tag];
				}
			}
		}
	}
	
	// Schriftgröße nach Häufigkeit festlegen. Es gibt fünf Schriftgrößen,
	// die gleichverteilt von 1 bis Maximum vergeben werden:
	// Bsp.: Maximum ist 40
	// Häufigkeit  1 -  8: Schriftgröße 1
	// Häufigkeit  9 - 16: Schriftgröße 2
	// Häufigkeit 17 - 24: Schriftgröße 3
	// Häufigkeit 25 - 32: Schriftgröße 4
	// Häufigkeit 33 - 40: Schriftgröße 5
	
	// HTML mit den Tags erzeugen
	var $tagcloud = $(`<div class="col-12"></div>`)
	
	// alle Tags in der Map durchlaufen
	for (tag in tagMap) {
		// Entsprechend der Häufigkeit des Tags die Schriftgröße zuweisen
		// Schriftgröße bestimmen, nach Häufigkeit in fünf Klassen 1 - 5 einordnen
		// Häufigkeit des Tags steht in tagMap[tag]
		var size = Math.ceil(Math.floor(tagMap[tag] / (max / 5.0)));
		$tagcloud.append($(`<a class="tag-${size}" href=${getEncodedUri(tag)}> ${tag}</a>`));
	}
	
	return $tagcloud;
};



function getArticlesByTag(tag){
	let articlesWithThisTag = [];
	for(let article of articles){
		for(let xTag of article.tags){
			if(xTag===tag)
			articlesWithThisTag.push(article);
		}
	}

	return articlesWithThisTag;
}