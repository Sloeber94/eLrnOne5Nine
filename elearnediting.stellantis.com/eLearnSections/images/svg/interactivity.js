//estraggo la querystring
var QS = top.location.href;

if (QS.indexOf("schemazoompre.aspx") != -1) {
    //alert(parent.location.href);
    QS = QS.replace("schemazoompre.aspx", "main.aspx");
}
var posQP = QS.indexOf("?");
var baseURLPath = QS.substring(0, posQP);

var lenghtQS = QS.length;
QS = QS.substring(posQP + 1, lenghtQS);
var arrQS = QS.split("&");
//creazione la nuova querystring per l'accodamento e gestisco l'examiner
var newQS = "";
var examiner = "";
for (i = 1; i < arrQS.length; i++) {
    if (arrQS[i].toLowerCase().indexOf("examiner") != -1) {
        examiner = arrQS[i];
    }
    newQS = newQS + "&" + arrQS[i];
}

//nodeID
var arrNodeID = arrQS[0].split("=");
nodeID = arrNodeID[1];

//examiner 
var arrExaminer = examiner.split("=");
var theExaminer = false;
if (arrExaminer[1] == 1) {
    theExaminer = true;
}

//FINE creazione la nuova querystring per l'accodamento e gestisco l'examiner

//inizializzo gli array del language
initArrayLang();
//trovo l'ID del language dalla querystring
var languageID = getLanguage();

//ARRAY GLOBALE DELLE DESCRIZIONI
var arrDESCR;
//variabili globali
var numEl = 0;
var oldID;
var olderID;
var baseColor = "#000000";
var colorToColor = "#03a8f8";
var colorLink = "#005c8b";
var strokeRect = "#03a8f8";
var fillRectPiccolo = "#03a8f8";
var colorNoLink = "black";
var colorX = "white";
var colorComponentText = "#000000";
var colorComponentName = "white";
var fillRect = "white";
var fillRectDescr = "#ffffcc";
var begin = true;
var rectWidth = 450;
var iFrameWidth = 555;
var iFrameHeight = 400;

var descrizioneDescr;
var memoDescr;

//funzioni
function getElementDaId(evt, elementId) {
    try {
        return evt.getTarget().getOwnerDocument().getElementById(elementId);
    }
    catch (e) {
        return document.getElementById(elementId);
    }
}

function getElementByEvent(evt) {
    try {
        return evt.getTarget();
    }
    catch (e) {
        return null;
    }
}

function linkRosso(evt, ID) {
    var elemento = getElementDaId(evt, ID);
    elemento.setAttribute("fill", "#03a8f8");
}

function linkBlu(evt, ID) {
    var elemento = getElementDaId(evt, ID);
    elemento.setAttribute("fill", colorLink);
}

function myDoOnMouseOver(evt, ID) {
    try {
        //estraggo l'id pulito
        arrID = ID.split('~');
        //alert(arrID[0]);
        //gestione duplicati
        //trovo tutti i nodi figlio e li setto a colore
        var objElement = getElementDaId(evt, ID);

        var parser = new XPathParser();
        var xpath = parser.parse("descendant::*");
        var context = new XPathContext();
        context.expressionContextNode = objElement;
        var result = xpath.evaluate(context);
        risultato = result.toArray() //array elementi selezionati

        for (i = 0; i < risultato.length; i++) {
            //risultato[i] è il nodo
            if (risultato[i].getAttribute("stroke") != "") {
                if (risultato[i].getAttribute("stroke") != colorToColor) {
                    risultato[i].setAttribute("bckstroke", risultato[i].getAttribute("stroke"));
                }
                risultato[i].setAttribute("stroke", colorToColor);
            }
            else if ((risultato[i].getAttribute("fill") != "") && (risultato[i].nodeName != "rect")) {
                if (risultato[i].getAttribute("fill") != colorToColor) {
                    risultato[i].setAttribute("bckfill", risultato[i].getAttribute("fill"));
                }
                risultato[i].setAttribute("fill", colorToColor);
            }
            else if (risultato[i].nodeName == "text") {
                if (risultato[i].getAttribute("fill") != colorToColor) {
                    risultato[i].setAttribute("bckfill", risultato[i].getAttribute("fill"));
                }
                risultato[i].setAttribute("fill", colorToColor);
            }
        }

        //creazione menu interattivo***********************************************************************
        //array delle parti contenenti gli ID
        var arrIDSplitQuadre = arrID[0].split("[")
        var arrIDSplitQuadreLenght = arrIDSplitQuadre.length;

        //creazione menu interattivo***********************************************************************
        try {
            var svgDocument = document;
        }
        catch (e)
        { }
        var svgTag = svgDocument.getElementsByTagName("svg").item(0);
        //nodi dei testi della finestra popup//////////////////////////////////////////////////////////////
        var gTextTag = svgDocument.createElement("g");
        gTextTag.setAttribute("id", "text?" + ID);
        gTextTag.setAttribute("style", "visibility:hidden");


        //nome componente-----------------------------------------------------------------------------------
        numElMenu = 1;
        CompTextTag = svgDocument.createElement("text");
        CompTextTag.setAttribute("id", "intext?" + ID + "?" + numElMenu);
        CompTextTag.setAttribute("font-family", "'ArialMT'");
        CompTextTag.setAttribute("font-size", "14");
        CompTextTag.setAttribute("fill", colorComponentName);
        if (arrIDSplitQuadre[0].toLowerCase().indexOf("hl") != -1) {
            var arrNomeComponente = arrIDSplitQuadre[0].split("-");
            var CompTextTagContent = svgDocument.createTextNode(arrNomeComponente[1]);
        }
        else {
            var CompTextTagContent = svgDocument.createTextNode(arrIDSplitQuadre[0]);
            memoDescr = arrIDSplitQuadre[0];
        }

        CompTextTag.appendChild(CompTextTagContent);
        gTextTag.appendChild(CompTextTag);
        numElMenu++;

        //links----------------------------------------------------------------------------------------------
        for (i = numElMenu; i <= arrIDSplitQuadreLenght; i++) {
            if (togliQuadra(arrIDSplitQuadre[i - 1]) != 0) {
                //estraggo il node ID
                var arrThisLink = arrIDSplitQuadre[i - 1].split("-");
                //descrizione componente
                if (arrThisLink[0] == "DESCR") {
                    var strDESCR = arrThisLink[1];
                    arrDESCR = strDESCR.split("$");
                    descrizioneDescr = setDescription("DESCR", languageID);
                    CompTextTagContent = svgDocument.createTextNode(" " + descrizioneDescr);
                    CompTextTag.appendChild(CompTextTagContent);
                    continue;
                }
                //fine descrizione componente
                var aTag = svgDocument.createElement("a");
                if ((arrThisLink[1] == 0) || (arrThisLink[1] == nodeID)) {
                    aTag.setAttribute("href", "#");
                    aTag.setAttribute("fill", colorNoLink);
                }
                else {
                    aTag.setAttributeNS("http://www.w3.org/1999/xlink", "href", baseURLPath + "?nodeID=" + arrThisLink[1] + newQS);
                    aTag.setAttribute("target", "_parent");
                    aTag.setAttribute("fill", colorLink);
                }

                aTextTag = svgDocument.createElement("text");
                aTextTag.setAttribute("id", "intext?" + ID + "?" + numElMenu);
                aTextTag.setAttribute("font-family", "'ArialMT'");
                aTextTag.setAttribute("font-size", "14");

                if ((arrThisLink[1] != 0) && (arrThisLink[1] != nodeID)) {
                    aTextTag.setAttribute("text-decoration", "none");
                    aTextTag.setAttribute("onmouseover", "linkRosso(evt,'intext?" + ID + "?" + numElMenu + "')")
                    aTextTag.setAttribute("onmouseout", "linkBlu(evt,'intext?" + ID + "?" + numElMenu + "')")
                }
                //descrizione in linguaggio
                descrizione = setDescription(arrThisLink[0], languageID);
                //codice della descrizione
                codiceDescrizione = togliQuadra(arrThisLink[2]);

                if ((codiceDescrizione == "") || (codiceDescrizione == "0") || (codiceDescrizione == 0)) {
                    var aTextContent = svgDocument.createTextNode(descrizione);
                }
                else {
                    var aTextContent = svgDocument.createTextNode(codiceDescrizione + " " + descrizione);
                }
                aTextTag.appendChild(aTextContent);
                aTag.appendChild(aTextTag);
                gTextTag.appendChild(aTag);
                numElMenu++;
            }
        }

        //x chiudi-----------------------------------------------------------------------------------------
        var aTag = svgDocument.createElement("a");
        aTag.setAttribute("href", "#");
        aTextTag = svgDocument.createElement("text");
        aTextTag.setAttribute("id", "aTextTag?" + ID);
        aTextTag.setAttribute("font-family", "'ArialMT'");
        aTextTag.setAttribute("font-size", "16");
        aTextTag.setAttribute("fill", colorX);
        aTextTag.setAttribute("onclick", "chiudiFinestra(evt,'" + ID + "')");
        //descrizione = setDescription("chiudi",languageID);//FRASE IN LINGUAGGIO
        var aTextContent = svgDocument.createTextNode("x");
        aTextTag.appendChild(aTextContent);
        aTag.appendChild(aTextTag);
        gTextTag.appendChild(aTag);
        svgTag.insertBefore(gTextTag, svgTag.lastChild);
        //FINE nodi dei testi della finestra popup//////////////////////////////////////////////////////////

        if (descrizioneDescr) {
            //var posX = evt.getClientX() + 20;
            //var posY = evt.getClientY() + 10;
            //creazione rattangolo descrizione-------------------------------------------------------------------------
            //var gRectTagDescr = svgDocument.createElement("g");
            //var rectTagDescr = svgDocument.createElement("rect");
            //rectTagDescr.setAttribute("id", "rectDescr?" + ID);
            //rectTagDescr.setAttribute("fill", fillRectDescr);
            //rectTagDescr.setAttribute("stroke", "#000000");
            //rectTagDescr.setAttribute("stroke-width", "1");
            //rectDescrWidth = iFrameWidth;
            //rectTagDescr.setAttribute("width", rectDescrWidth);
            //rectTagDescr.setAttribute("height", 20);
            //gRectTagDescr.appendChild(rectTagDescr);
            //svgTag.insertBefore(gRectTagDescr, gTextTag);
            //rectTagDescr.setAttribute("x", 0);
            //rectTagDescr.setAttribute("y", 0);
            //creazione testo descrizione
            //descrTextTag = svgDocument.createElement("text");
            //descrTextTag.setAttribute("id", "textDescr?" + ID);
            //descrTextTag.setAttribute("font-family", "'ArialMT'");
            //descrTextTag.setAttribute("font-size", "14");
            //descrTextTag.setAttribute("fill", colorComponentText);
            //descrTextTagContent = svgDocument.createTextNode(memoDescr + " " + descrizioneDescr);
            //descrTextTag.appendChild(descrTextTagContent);
            //gRectTagDescr.appendChild(descrTextTag);
            //descrTextTag.setAttribute("x", 5);
            //descrTextTag.setAttribute("y", 15);
            svgDocument.getElementById("rectDescr?" + ID).setAttribute("style", "visibility:visible");
            svgDocument.getElementById("textDescr?" + ID).setAttribute("style", "visibility:visible");
        }


        //creazione rettangolo grande------------------------------------------------------------------------------
        var gRectTag = svgDocument.createElement("g");
        var rectTag = svgDocument.createElement("rect");
        rectTag.setAttribute("id", "rect?" + ID);
        rectTag.setAttribute("fill", fillRect);
        rectTag.setAttribute("stroke", strokeRect);
        rectTag.setAttribute("stroke-width", "1");
        rectTag.setAttribute("width", rectWidth);
        rectTag.setAttribute("style", "visibility:hidden");
        gRectTag.appendChild(rectTag);
        svgTag.insertBefore(gRectTag, gTextTag);
        //creazione rettangolo piccolo-----------------------------------------------------------------------------
        var gRectTagPiccolo = svgDocument.createElement("g");
        var rectTagPiccolo = svgDocument.createElement("rect");
        rectTagPiccolo.setAttribute("id", "rectPiccolo?" + ID);
        rectTagPiccolo.setAttribute("fill", fillRectPiccolo);
        rectTagPiccolo.setAttribute("stroke", strokeRect);
        rectTagPiccolo.setAttribute("stroke-width", "1");
        rectTagPiccolo.setAttribute("width", rectWidth);
        rectTagPiccolo.setAttribute("height", 25);
        rectTagPiccolo.setAttribute("style", "visibility:hidden");
        gRectTagPiccolo.appendChild(rectTagPiccolo);
        svgTag.insertBefore(gRectTagPiccolo, gRectTag);
        //FINE creazione menu interattivo***********************************************************************

        //variabile che serve al mouse out per recuperare l'elemento da settare a nero
        oldID = ID;
    }
    catch (e) {
        //alert("Loading...");
    }
}

function myDoOnMouseOut(evt, ID) {
    try {
        //trovo tutti i nodi figlio e li setto a nero
        var objElement = getElementDaId(evt, oldID);
        var parser = new XPathParser();
        var xpath = parser.parse("descendant::*");
        var context = new XPathContext();
        context.expressionContextNode = objElement;
        var result = xpath.evaluate(context);
        risultato = result.toArray() //array elementi selezionati

        for (i = 0; i < risultato.length; i++) {
            //risultato[i] è il nodo
            if (risultato[i].getAttribute("stroke") == colorToColor) {
                //risultato[i].setAttribute("stroke",baseColor)
                risultato[i].setAttribute("stroke", risultato[i].getAttribute("bckstroke"))
            }
            else if (risultato[i].getAttribute("fill") == colorToColor) {
                //risultato[i].setAttribute("fill",baseColor)
                risultato[i].setAttribute("fill", risultato[i].getAttribute("bckfill"))
            }
        }

        if (descrizioneDescr) {
            //tolgo la visibilità alla descrizione
            //var rectDescr = getElementDaId(evt, "rectDescr?" + oldID)
            ////rectDescr.setAttribute("style","visibility:visible");
            //rectDescr.parentNode.removeChild(rectDescr);
            //var textDescr = getElementDaId(evt, "textDescr?" + oldID)
            ////textDescr.setAttribute("style","visibility:visible");
            //textDescr.parentNode.removeChild(textDescr);
            document.getElementById("rectDescr?" + oldID).setAttribute("style", "visibility:hidden");
            document.getElementById("textDescr?" + oldID).setAttribute("style", "visibility:hidden");
            memoDescr = "";
            descrizioneDescr = ""
        }
    }
    catch (e) {
        //alert("Loading...");
    }
}

function setMenu(evt, ID) {
    try {
        //chiudo la finestra aperta precedentemente solo quando setto il menu per finestre successive alla prima
        if (olderID) {
            chiudiFinestra(evt, olderID)
        }

        //posizionamento elementi
        //variabili di posizione rettangolo link
        /*var posX = evt.getClientX() + 20;
        var posY = evt.getClientY() + 10;*/

        //posiziono la finestra al centro del disegno
        var posX = (iFrameWidth / 2) - 200;
        var posY = (iFrameHeight / 2) - 40;

        //variabili di posizione scritte link
        var posizioneX = posX + 5;
        //var posizioneY = posY + 20;
        var posizioneY = posY - 6;
        //FINE posizionamento elementi

        //visibilità rect piccolo
        try {
            var svgDocument = document;
        }
        catch (e)
        { }
        svgDocument.getElementById("rectPiccolo?" + ID).setAttribute("style", "visibility:visible");
        svgDocument.getElementById("rectPiccolo?" + ID).setAttribute("x", posX);
        svgDocument.getElementById("rectPiccolo?" + ID).setAttribute("y", posY - 25);
        //visibilità rect
        svgDocument.getElementById("rect?" + ID).setAttribute("style", "visibility:visible");
        svgDocument.getElementById("rect?" + ID).setAttribute("x", posX);
        svgDocument.getElementById("rect?" + ID).setAttribute("y", posY);
        //visibilità blocco g text
        svgDocument.getElementById("text?" + ID).setAttribute("style", "visibility:visible");
        //visibilità X chiudi
        svgDocument.getElementById("aTextTag?" + ID).setAttribute("x", posX + 437);
        svgDocument.getElementById("aTextTag?" + ID).setAttribute("y", posY - 11);

        //posizionamento elementi di testo interni al g di testo
        //trovo tutti i nodi figlio del g di testo
        var objElement = svgDocument.getElementById("text?" + ID);
        var parser = new XPathParser();
        var xpath = parser.parse("descendant::*");
        var context = new XPathContext();
        context.expressionContextNode = objElement;
        var result = xpath.evaluate(context);
        risultato = result.toArray();

        numInText = 1;
        for (i = 0; i < risultato.length - 1; i++) {
            if (risultato[i].getAttribute("id") != "") {
                try {
                    svgDocument.getElementById("intext?" + ID + "?" + numInText).setAttribute("x", posizioneX);
                    svgDocument.getElementById("intext?" + ID + "?" + numInText).setAttribute("y", posizioneY);
                    posizioneY += 22;
                } catch (e) { }
                numInText++;
            }
        }
        //setto l'altezza del rettangolo
        svgDocument.getElementById("rect?" + ID).setAttribute("height", numInText * 17);
        //FINE posizionamento elementi di testo interni al g di testo

        olderID = ID;
    }
    catch (e) {
        //alert("Loading...");
    }
}

function chiudiFinestra(evt, ID) {
    try {
        //var el = svgDocument.getElementById("rect?" + ID);
        //if (el == null) el = getAlternateElementByNameAndId(evt.document, "rect", "rect?" + ID);
        document.getElementById("rect?" + ID).setAttribute("style", "visibility:hidden");
        document.getElementById("rectPiccolo?" + ID).setAttribute("style", "visibility:hidden");
        document.getElementById("text?" + ID).setAttribute("style", "visibility:hidden");
    }
    catch (e) {
    }
}

function initArrayLang() {
    var strCG = "1^CABLAGGI$2^WIRING$3^KABEL$4^CABLEADOS$5^CÂBLAGES$6^KABELBUNDELS$7^CABLAGENS$8^KABELOVÉ SVAZKY $9^WIAZKI PRZEWODÓW$10^Καλωδιώσεις$11^KABLOLAR";
    arrCG = strCG.split("$");
    var strCB = "1^CABLAGGI$2^WIRING$3^KABEL$4^CABLEADOS$5^CÂBLAGES$6^KABELBUNDELS$7^CABLAGENS$8^KABELOVÉ SVAZKY $9^WIAZKI PRZEWODÓW$10^Καλωδιώσεις$11^KABLOLAR";
    arrCB = strCB.split("$");
    var strLC = "1^LOCALIZZAZIONE COMPONENTI$2^COMPONENT LOCATION$3^LOKALISIERUNG DER BAUTEILE$4^UBICACIÓN DE LOS COMPONENTES$5^EMPLACEMENT DES COMPOSANTS$6^OPSTELLING VAN COMPONENTEN$7^LOCALIZAÇÃO DOS COMPONENTES$8^ROZMÍST?NÍ SOU?ÁSTÍ$9^LOKALIZACJA ELEMENTÓW$10^ΤΟΠΟΘΕΣΙΑ ΕΞΑΡΤΗΜΑΤΩΝ$11^DE  -PARÇALARIN YERLERİ";//cablaggio funzionale
    arrLC = strLC.split("$");
    var strPR = "1^PROCEDURE$2^PROCEDURES$3^Vorgänge$4^Procedimientos$5^Procédures$6^Procedures$7^Procedimentos$8^Postupy$9^Procedury$10^Διαδικασίες$11^Prosedürler";
    arrPR = strPR.split("$");
    var strDF = "1^DESCRIZIONE FUNZIONALE$2^FUNCTIONAL DESCRIPTION$3^FUNKTIONSBESCHREIBUNG$4^DESCRIPCIÓN FUNCIONAL$5^DESCRIPTION DU FONCTIONNEMENT$6^FUNCTIEBESCHRIJVING$7^DESCRIÇÃO FUNCIONAL$8^FUNKČNÍ POPIS$9^OPIS FUNKCJONALNY$10^ΠΕΡΙΓΡΑΦΗ ΛΕΙΤΟΥΡΓΙΑ$11^TARİF";
    arrDF = strDF.split("$");
    var strDC = "1^CONNETTORI$2^CONNECTORS$3^STECKER$4^CONECTORES$5^CONNECTEURS$6^STEKKERS$7^CONECTORES$8^KONEKTORY$9^ZLACZA KONEKTOROWE$10^Φις σύνδεσης$11^SOKETLER";
    arrDC = strDC.split("$");
    var strSE = "1^SCHEMA ELETTRICO$2^WIRING DIAGRAM$3^SCHALTPLAN$4^ESQUEMA ELÉCTRICO$5^SCHEMA ELECTRIQUE$6^ELEKTRISCH SCHEMA$7^ESQUEMA ELÉCTRICO$8^ELEKTRICKÉ SCHEMA$9^SCHEMAT ELEKTRYCZNY$10^ΗΛΕΚΤΡΙΚΟ ΔΙΑΓΡΑΜΜΑ$11^DE-ELEKTRİK ŞEMALARI";
    arrSE = strSE.split("$");
    var strChiudi = "1^CHIUDI$2^CLOSE";
    arrChiudi = strChiudi.split("$");
    var strNull = "$";
    arrNull = strNull.split("1^$2^");
}

function setDescription(linkType, theIDLanguage) {
    try {
        linkType = linkType.toUpperCase();
        switch (linkType) {
            case "DESCR":
                arrayLang = arrDESCR;
                break;
            case "CG":
                arrayLang = arrCG;
                break;
            case "CB":
                arrayLang = arrCB;
                break;
            case "LC":
                arrayLang = arrLC;
                break;
            case "PR":
                arrayLang = arrPR;
                break;
            case "DF":
                arrayLang = arrDF;
                break;
            case "DC":
                arrayLang = arrDC;
                break;
            case "SE":
                arrayLang = arrSE;
                break;
            case "CHIUDI":
                arrayLang = arrChiudi;
                break;
            case "":
                arrayLang = arrNull;
                break;
        }

        ritorno = false;
        for (ii = 0; ii < arrayLang.length; ii++) {
            arrOfLang = arrayLang[ii].split("^");
            if (arrOfLang[0] == theIDLanguage) {
                theDescription = togliQuadra(arrOfLang[1]);
                ritorno = true;
                break;
            }
        }

        if (ritorno == true) {
            return theDescription;
        }
        else {
            return setDescription(linkType, 2);
        }
    }
    catch (e) {
    }
}

function setinfoDef(evt, object_id) {
    try {
        //if(theExaminer==false)
        //{
        //alert("a");
        numEl++;
        var IDEl = object_id + "~" + numEl;
        var el = getElementByEvent(evt);
        if (el == null) {
            var list = document.getElementsByTagName("g");
            for (i = 0; i < list.length; i++) {
                try {
                    id = list[i].getAttribute("onload");
                    if (id == null) { continue; }
                    if (id.indexOf(object_id) > 0) {
                        el = list[i];
                        break;
                    }
                }
                catch (e) { }
            }
        }

        el.setAttribute("id", IDEl);
        el.setAttribute("onmouseover", "myDoOnMouseOver(evt,'" + IDEl + "')");
        el.setAttribute("onmouseout", "myDoOnMouseOut(evt)");

        idLowCase = object_id.toLowerCase();
        if ((idLowCase.indexOf("_") == -1) || (numberOfUnderscore(object_id) == 1) || (idLowCase.indexOf("hl") != -1)) {
            el.setAttribute("onclick", "setMenu(evt,'" + IDEl + "')");
        }
        //}
    }
    catch (e) {
        //alert("Loading...");
    }
}

function numberOfUnderscore(ID) {
    try {
        var posUnderscore = ID.indexOf("_");
        if (posUnderscore == ID.length - 1) {
            return 1;
        }

        var endSubstring = ID.length - 1;
        var beginSubstring = posUnderscore + 1;
        var stringAfterUnderScore = ID.substring(beginSubstring, endSubstring);

        if (stringAfterUnderScore.indexOf("_") == -1) {
            return 1;
        }
        else {
            return 2;
        }
    }
    catch (e) {
    }
}

function togliQuadra(stringa) {
    try {
        if ((stringa.indexOf("]") == stringa.length - 1) && (stringa != "")) {
            return stringa.substring(0, stringa.length - 1);
        }
        else {
            return stringa;
        }
    }
    catch (e) {
    }
}

function getLanguage() {
    var id = 2;
    for (i = 1; i < arrQS.length; i++) {
        if (arrQS[i].toLowerCase().indexOf("languageid") != -1) {
            var posUguale = arrQS[i].indexOf("=");
            var stringLenght = arrQS[i].length;
            var inizio = posUguale + 1;
            var fine = stringLenght;
            id = parseInt(arrQS[i].substring(inizio, fine));
            break;
        }
    }
    for (i = 1; i < arrQS.length; i++) {
        if (arrQS[i].toLowerCase().indexOf("defaultid") != -1) {
            var posUguale = arrQS[i].indexOf("=");
            var stringLenght = arrQS[i].length;
            var inizio = posUguale + 1;
            var fine = stringLenght;
            id = parseInt(arrQS[i].substring(inizio, fine));
            break;
        }
    }
    return id;
}

//    var posUguale = arrQS[1].indexOf("=");
//    var stringLenght = arrQS[1].length;
//    var inizio = posUguale + 1;
//    var fine = stringLenght;
//    return parseInt(arrQS[1].substring(inizio, fine));
//}

function getAlternateElementByNameAndId(document, name, ID) {
    var x = document.getElementsByTagName(name);
    var i;
    var found = false;
    for (i = 0; i < x.length; i++) {
        for (j = 0; j < x[i].attributes.length; j++) {
            if (x[i].attributes[j].nodeName == "id") {
                if (x[i].attributes[j].nodeValue == ID) {
                    return x[i];
                }
            }
        }
    }
    return null;
}