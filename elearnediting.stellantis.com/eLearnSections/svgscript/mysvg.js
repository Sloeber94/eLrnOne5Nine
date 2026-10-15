var start;
start="0 0 734 447";


function svgBase(img)
{
		
			var a= img.getSVGDocument()
			var SVGRoot = a.getDocumentElement();
			SVGRoot.setAttribute("viewBox", start);

		
}


function svgZoom(img,f)
{
		var a= img.getSVGDocument()
		var SVGRoot = a.getDocumentElement();
		var viewbox = SVGRoot.getAttribute("viewBox");

		var coords  = viewbox.split(/ /);		
		w=(coords[2]-(-coords[0]))/2
		h=(coords[3]-(-coords[1]))/2
		if (w<0)
			{
				p=coords[2]
				coords[2]=coords[0]
				coords[0]=p
			}
		if (h<0)
			{
				p=coords[3]
				coords[3]=coords[1]
				coords[1]=p
			}
		trxx=0
		tryy=0
		coords[0]=(coords[0]*f);
		coords[1]=(coords[1]*f);
		coords[2]=(coords[2]*f);
		coords[3]=(coords[3]*f);
		w2=(coords[2]-(-coords[0]))/2
		h2=(coords[3]-(-coords[1]))/2
		tx=w-w2
		ty=h-h2
		coords[0]+=tx/2;	
		coords[2]+=tx/2;
		coords[1]+=ty/2;
		coords[3]+=ty/2;

		SVGRoot.setAttribute("viewBox", coords.join(" "));

}

function svgMove(img,x,y)
{

		var a= img.getSVGDocument();
		var SVGRoot = a.getDocumentElement();
		var viewbox = SVGRoot.getAttribute("viewBox");
		var coords  = viewbox.split(/ /);
		x=x*3
		y=y*3
		coords[0]-=x;
		coords[1]-=y;
		coords[2]-=x;
		coords[3]-=y;
		SVGRoot.setAttribute("viewBox", coords.join(" "));
		if (x<0)  svgZoom(img,0.97)
		if (x>0)  svgZoom(img,1.04)

}



