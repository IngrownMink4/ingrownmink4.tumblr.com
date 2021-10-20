<script>
// Expects <picture><source media="(media_query)" srcset="big"><img src="small"></picture>
void function stupid_picture_polyfill() {
	var pics = document.querySelectorAll('.fullres > picture > source + img');
	if (pics.length === 0) return;
	if ('currentSrc' in pics[0] || !'matchMedia' in window) return;
	for (var i=0; i < pics.length; i++) {
		var pic = pics[i], source = pic.previousElementSibling;
		var mq = source.getAttribute('media');
		var newsrc = source.getAttribute('srcset');
		if (newsrc && window.matchMedia(mq).matches) {
			pic.src = newsrc;
		}
	}
}();
</script>
{/block:IfFullresPhotoPosts}

{block:IfNotHideNotesLink}
<script>
void function xhr_tumblr_notes() {
	function addNotes(url, container) {
		var request = new XMLHttpRequest();
		request.onload = function(){
			var html = '<hr>
' + this.responseText;
			container.insertAdjacentHTML('beforeend', html);
		}
		request.open('GET', url, true);
		request.send();
	}
	var link = document.querySelector('.notes-link');
	if (link) {
		var container = document.querySelector('.notes-container');
		link.addEventListener('click', function(event){
			event.preventDefault();
			addNotes(link.href, container);
			var span = document.createElement('span');
			span.className = 'notes-count';
			span.textContent = link.textContent;
			link.parentElement.replaceChild(span, link);
		});
	}
}();
</script>
{/block:IfNotHideNotesLink}

<script>
void function attach_tumblr_lightbox() {
	function viewportW() {
		var a = document.documentElement.clientWidth;
		var b = window.innerWidth;
		return a < b ? b : a;
	}
	function getImgInfo(link) {
		return {
			'width': link.getAttribute('data-width'),
			'height': link.getAttribute('data-height'),
			'low_res': link.getAttribute('data-lowres'),
			'high_res': link.href
		}
	}
	function callLightbox(event) {
		if (viewportW() < 600) {
			return;
		}
		var set = [], thisIndex = 1;
		var thisLink = event.currentTarget;
		var links = thisLink.parentElement.querySelectorAll('a');
		for (var i=0; i<links.length; i++) {
			if (links[i] === thisLink) {
				thisIndex = i + 1;
			}
			set.push(getImgInfo(links[i]));
		}
		if (Tumblr.Lightbox && set.length > 0) {
			event.preventDefault();
			Tumblr.Lightbox.init(set, thisIndex);
		}
	}
	// Init
	var imgLinks = document.querySelectorAll('.UseTumblrLightbox > a');
	for (var i=0, l=imgLinks.length; i<l; i++) {
		imgLinks[i].addEventListener('click', callLightbox);
	}
}();
</script>

{block:IfAddCollapseButtonsToQuotes}
<script>
void function toggle_those_blockquotes() {
	function makeBtn(para, quote) {
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'quote-toggle';
		btn.innerHTML = '<span>Toggle quote</span>';
		btn.addEventListener('click', function(event){
			var btn = event.currentTarget;
			btn.classList.toggle('hidden');
			quote.classList.toggle('hidden');
		});
		para.appendChild(btn);
	}
	function process(para, quote) {
		// mark short quotes
		if (quote.textContent.length < 80) {
			para.className += ' short';
		}
		// looking for the <p><a>someone</a>:</p> pattern.
		var link = para.querySelector('a:last-of-type');
		if (link !== null && /[a-z0-9-]+/.test(link.textContent.trim())) {
			var nxt = link.nextSibling;
			var end = para.lastChild;
			if (nxt !== end) return;
			if (end.textContent.trim() === ':') {
				para.className += ' quote-meta';
				link.className += ' quote-author';
				makeBtn(para, quote);
			}
		}
	}
	var quotes = document.querySelectorAll('.maintext p + blockquote');
	for (var i=0, l=quotes.length; i<l; i++) {
		process(quotes[i].previousElementSibling, quotes[i]);
	}
}();
</script>
