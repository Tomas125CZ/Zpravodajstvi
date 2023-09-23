var startWindowSize = window.screen.width * 2;
function start() {
    var code = '<div class="bubble"></div>';
    var final = "";
    for(var i = 0; i < 100; i++) {
        final += code;
    }
    document.getElementsByClassName("bubbles")[0].innerHTML = final;
    for(var i = 0; i < 100; i++) {
        document.getElementsByClassName("bubble")[i].dataset.marginleft = Math.round(Math.random() * startWindowSize) - 15;
        var size = Math.round(Math.random() * 10) + 5;
        document.getElementsByClassName("bubble")[i].style.width = size + "px";
        document.getElementsByClassName("bubble")[i].style.height = size + "px";
        document.getElementsByClassName("bubble")[i].style.marginLeft = document.getElementsByClassName("bubble")[i].dataset.marginleft + "px";
        document.getElementsByClassName("bubble")[i].style.marginTop = Math.round(Math.random() * 430) + "px";
        if(i % 2 == 0) {
            document.getElementsByClassName("bubble")[i].dataset.direction = -1;
        }
        else {
            document.getElementsByClassName("bubble")[i].dataset.direction = 1;
        }
        document.getElementsByClassName("bubble")[i].dataset.speed = 0;
        document.getElementsByClassName("bubble")[i].dataset.speed = Math.round(Math.random() * 3) + 7;
    }
    setInterval(move, 10);  
}
function move() {
    for(var i = 0; i < 100; i++) {
        document.getElementsByClassName("bubble")[i].style.marginTop = (Number(document.getElementsByClassName("bubble")[i].style.marginTop.replace("px", "")) - (document.getElementsByClassName("bubble")[i].dataset.speed/10)) + "px";
        document.getElementsByClassName("bubble")[i].style.marginLeft = (Number(document.getElementsByClassName("bubble")[i].style.marginLeft.replace("px", "")) - (document.getElementsByClassName("bubble")[i].dataset.direction * document.getElementsByClassName("bubble")[i].dataset.speed/50)) + "px";
        if(Number(document.getElementsByClassName("bubble")[i].style.marginTop.replace("px", "")) < 0) {
            document.getElementsByClassName("bubble")[i].style.marginTop = 430 + "px";
            document.getElementsByClassName("bubble")[i].dataset.marginleft = Math.round(Math.random() * startWindowSize) - 15;
            var size = Math.round(Math.random() * 10) + 5;
            document.getElementsByClassName("bubble")[i].style.height = size + "px";
            document.getElementsByClassName("bubble")[i].style.width = size + "px";
            document.getElementsByClassName("bubble")[i].style.marginLeft = document.getElementsByClassName("bubble")[i].dataset.marginleft + "px";
            if(i % 2 == 0) {
                document.getElementsByClassName("bubble")[i].dataset.direction = -1;
            }
            else {
                document.getElementsByClassName("bubble")[i].dataset.direction = 1;
            }
            document.getElementsByClassName("bubble")[i].dataset.speed = Math.round(Math.random() * 3) + 7;
        }
    }
}

function load() {
    clearFile("searching");
}

function loadNewsPage(normalPage = true) {
    loadNews();
    loadNewsFromFile();
    if(normalPage) setUpNews();
}

function loadUsersPage() {
    setUpUsers();
}

function loginButtonClick() {
    logOut();
    setTimeout(loginForm, 50);
}


function logOut() {
    clearFile("savedUsername");
    clearFile("savedPassword");
    clearFile("savedJoinDate");
    clearFile("savedTotalArticles");
}

function openArticle(index = "") {
    clearFile("searching");
    saveToFile("searching", index);
    openWebsite("article.html");
}

function playerInfo() {
    openWebsite("accountManager.html");
}

var currentpx = 350;

function loadUser() {
    var username = getFromFileByIndex("savedUsername", 0);
    var password = getFromFileByIndex("savedPassword", 0);
    var joindate = getFromFileByIndex("savedJoinDate", 0);
    var totalarticles = getFromFileByIndex("savedTotalArticles", 0);
    console.log("LOAD: " + username + " " + password + " " + joindate + " " + totalarticles);
    username = username.replaceAll("null", "");
    password = password.replaceAll("null", "");
    joindate = joindate.replaceAll("null", "");
    totalarticles = totalarticles.replaceAll("null", "");
    console.log("LOAD: " + username + " " + password + " " + joindate + " " + totalarticles);
    user = new User(username, password, joindate, Number(totalarticles));
}

function login() {
    var username = document.getElementById("nick").value;
    var password = document.getElementById("password").value;
    if(username.trim() == "") {
        document.getElementsByClassName("error")[0].innerHTML = "Musíš zadat uživatelské jméno!";
        document.getElementById("password").value = "";
        document.getElementById("nick").value = "";
        document.querySelector(":root").style.setProperty("--logregheight", (currentpx + 40) + "px");
        return;
    }
    if(password.trim() == "") {
        document.getElementsByClassName("error")[0].innerHTML = "Musíš zadat heslo!";
        document.getElementById("password").value = "";
        document.getElementById("nick").value = "";
        document.querySelector(":root").style.setProperty("--logregheight", (currentpx + 40) + "px");
        return;
    }
    console.log("USERNAME: " + username)
    console.log("EXISTS: " + existsUsername(username))
    if(!existsUsername(username)) {
        document.getElementsByClassName("error")[0].innerHTML = "Neznáme přihlašovací údaje!";
        document.getElementById("password").value = "";
        document.getElementById("nick").value = "";
        document.querySelector(":root").style.setProperty("--logregheight", (currentpx + 40) + "px");
        return;
    }
    var inFile = getIndexOfUserInFile("usernames", username);
    if(!haveCorrectLoginInformation(password, inFile)) {
        document.getElementsByClassName("error")[0].innerHTML = "Neznáme přihlašovací údaje!";
        document.getElementById("password").value = "";
        document.getElementById("nick").value = "";
        document.querySelector(":root").style.setProperty("--logregheight", (currentpx + 40) + "px");
        return;
    }
    document.getElementsByClassName("logreg")[0].innerHTML = "";
    document.querySelector(":root").style.setProperty("--logregheight", "0");
    document.querySelector(":root").style.setProperty("--logregvisibility", "hidden");
    var user = new User(getFromFileByIndex("usernames", inFile), getFromFileByIndex("passwords", inFile), getFromFileByIndex("joindates", inFile), getFromFileByIndex("totalarticles", inFile));
    user.printInformation();
    clearFile("savedUsername");
    clearFile("savedPassword");
    clearFile("savedJoinDate");
    clearFile("savedTotalArticles");
    saveToFile("savedUsername", user.getName());
    saveToFile("savedPassword", user.getPassword());
    saveToFile("savedJoinDate", user.getJoinDate());
    saveToFile("savedTotalArticles", user.getTotalArticles());
}

function haveCorrectLoginInformation(password = "", inFile = 0) {
    var neededPassword = getFromFileByIndex("passwords", inFile);
    if(neededPassword == null) return true;
    neededPassword = neededPassword.replaceAll("null", "");
    return (password == neededPassword);
}

function getFromFileByIndex(fileName = "", index = 0) {
    if(getFromFile(fileName) == null) return "";
    if(!getFromFile(fileName).includes("#%*")) return getFromFile(fileName);
    var file = getFromFile(fileName).split("#%*");
    return file[index];
}

function getFromFileByNick(fileName = "", nick = "") {
    if(getFromFile(fileName) == null) return "";
    if(!getFromFile(fileName).includes("#%*")) return getFromFile(fileName);
    if(getFromFile("usernames") == null) return "";
    if(!getFromFile("usernames").includes("#%*")) return getFromFile(fileName);
    var file = getFromFile(fileName).split("#%*");
    var nicks = getFromFile("usernames").split("#%*");
    for(var x = 0; x < file; x++) {
        if(nicks[x] == nick) {
            return file[x];
        }
    }
    return "";
}

function getLengthOfFile(fileName = "") {
    if(getFromFile(fileName) == null) return 0;
    if(!getFromFile(fileName).includes("#%*")) 0;
    var file = getFromFile(fileName).split("#%*");
    return file.length;
}

function register() {
    var username = document.getElementById("nick").value;
    var password1 = document.getElementById("password").value;
    var password2 = document.getElementById("passwordagain").value;
    if(username.trim() == "") {
        document.getElementsByClassName("error")[0].innerHTML = "Musíš zadat uživatelské jméno!";
        document.getElementById("password").value = "";
        document.getElementById("passwordagain").value = "";
        document.getElementById("nick").value = "";
        document.querySelector(":root").style.setProperty("--logregheight", (currentpx + 40) + "px");
        return;
    }
    if(password1.trim() == "") {
        document.getElementsByClassName("error")[0].innerHTML = "Musíš zadat heslo!";
        document.getElementById("password").value = "";
        document.getElementById("passwordagain").value = "";
        document.getElementById("nick").value = "";
        document.querySelector(":root").style.setProperty("--logregheight", (currentpx + 40) + "px");
        return;
    }
    if(password2.trim() == "") {
        document.getElementsByClassName("error")[0].innerHTML = "Musíš zopakovat heslo!";
        document.getElementById("password").value = "";
        document.getElementById("passwordagain").value = "";
        document.getElementById("nick").value = "";
        document.querySelector(":root").style.setProperty("--logregheight", (currentpx + 40) + "px");
        return;
    }
    if(password1 != password2) {
        document.getElementsByClassName("error")[0].innerHTML = "Hesla se neschodují!";
        document.getElementById("password").value = "";
        document.getElementById("passwordagain").value = "";
        document.getElementById("nick").value = "";
        document.querySelector(":root").style.setProperty("--logregheight", (currentpx + 40) + "px");
        return;
    }
    if(password1.split("").length < 8) {
        document.getElementsByClassName("error")[0].innerHTML = "Heslo musí mít minimálně 8 znaků!";
        document.getElementById("password").value = "";
        document.getElementById("passwordagain").value = "";
        document.getElementById("nick").value = "";
        document.querySelector(":root").style.setProperty("--logregheight", (currentpx + 40) + "px");
        return;
    }
    if(!containsNumber(password1)) {
        document.getElementsByClassName("error")[0].innerHTML = "Heslo musí obsahovat alespoň 1 číslici!";
        document.getElementById("password").value = "";
        document.getElementById("passwordagain").value = "";
        document.getElementById("nick").value = "";
        document.querySelector(":root").style.setProperty("--logregheight", (currentpx + 40) + "px");
        return;
    }
    if(existsUsername(username)) {
        document.getElementsByClassName("error")[0].innerHTML = "Zadané uživatelské jméno aktuálně existuje!";
        document.getElementById("password").value = "";
        document.getElementById("passwordagain").value = "";
        document.getElementById("nick").value = "";
        document.querySelector(":root").style.setProperty("--logregheight", (currentpx + 40) + "px");
        return;
    }
    createProfile();
    loginForm();
}

function existsUsername(user = "") {
    console.log(getFromFile("usernames"));
    if(user == "Tomáš Urban") return true;
    if(user == "Tomáš Josef Najman") return true;
    if(user == "Stanislav Tesař") return true;
    if(getFromFile("usernames") == null) return false;
    if(!(getFromFile("usernames").includes("#%*"))) return false;
    var users = getFromFile("usernames").replaceAll("null", "").split("#%*");
    return users.includes(user);
}

function containsNumber(text = "") {
    return text.includes(0) || text.includes(1) || text.includes(2) || text.includes(3) || text.includes(4) || text.includes(5) || text.includes(6) || text.includes(7) || text.includes(8) || text.includes(9);
}

function registerForm() {
    currentpx = 350;
    document.querySelector(":root").style.setProperty("--logregheight", "350px");
    document.querySelector(":root").style.setProperty("--logregvisibility", "visible");
    document.getElementsByClassName("logreg")[0].innerHTML = '<div class="logregTitle"><div>Registrace</div></div><div class="error"></div><div class="nickD"><div class="logregIMG"><img src="images/userLogin.png" alt=""></div><input type="text" placeholder="Uživatelské jméno" id="nick"></div><div class="passwordD"><div class="logregIMG"><img src="images/password.png" alt=""></div><input type="password" placeholder="Heslo" id="password"></div><div class="passwordD"><div class="logregIMG"><img src="images/password.png" alt=""></div><input type="password" placeholder="Heslo znovu" id="passwordagain"></div><div class="logregbutton" onclick="' + "register()" + '">Zaregistrovat se</div><div class="logregSwap">Již jsi členem? <span onclick="loginForm()">Přihlaš se</span></div>';
}

function loginForm() {
    currentpx = 300;
    document.querySelector(":root").style.setProperty("--logregheight", "300px");
    document.querySelector(":root").style.setProperty("--logregvisibility", "visible");
    document.getElementsByClassName("logreg")[0].innerHTML = '<div class="logregTitle"><div>Přihlášení</div></div><div class="error"></div><div class="nickD"><div class="logregIMG"><img src="images/userLogin.png" alt=""></div><input type="text" placeholder="Uživatelské jméno" id="nick"></div><div class="passwordD"><div class="logregIMG"><img src="images/password.png" alt=""></div><input type="password" placeholder="Heslo" id="password"></div><div class="logregbutton" onclick="' + "login()" + '">Přihlásit se</div><div class="logregSwap">Nejsi členem? <span onclick="registerForm()">Zaregistruj se</span></div>';
}

function createProfile() {
    saveToFile("usernames", document.getElementById("nick").value);
    saveToFile("passwords", document.getElementById("password").value);
    saveToFile("joindates", getDate());
    saveToFile("totalarticles", 0);
}

function saveToFile(fileName = "", content = "") {
    var aftercontent = localStorage.getItem(fileName);
    if(aftercontent == null) aftercontent = ""; 
    aftercontent += content + "#%*";
    localStorage.setItem(fileName, aftercontent);
}

function clearFile(fileName = "") {
    localStorage.setItem(fileName, "");
}

function getFromFile(fileName = "") {
    return localStorage.getItem(fileName);
}

function getIndexOfUserInFile(usernameFileName = "", username = "") {
    if(getFromFile(usernameFileName) == null) return -1;
    if(getFromFile(usernameFileName) == "") return -1;
    var users = getFromFile(usernameFileName).split("#%*");
    for(var x = 0; x < users.length; x++) {
        if(username == users[x]) {
            return x;
        }
    }
    return -1;
}

function loadProfile() {
    document.getElementById("name").innerHTML = nick;
    document.getElementById("passwordT").innerHTML = password;
    document.getElementById("joindate").innerHTML = getDate();
    document.getElementById("totalarticles").innerHTML = "0";
}

function openWebsite(website = "", samePage = true) {
    if(!samePage) window.open(website);
    else window.open(website, "_self");
}

function getDate() {
    let date = new Date()
    return date.toISOString().split('T')[0]
}

var total = 5;
var startTotal = 5;
var images = new Array(total);
var titles = new Array(total);
var contents = new Array(total);
var subtitles = new Array(total);
var dates = new Array(total);
var authors = new Array(total);


class User {

    constructor(name, password, joindate, totalarticles) {
        this.name = name;
        this.password = password;
        this.joindate = joindate;
        this.totalarticles = totalarticles;
    }

    getName() {
        return this.name;
    }

    getPassword() {
        return this.password;
    }

    getJoinDate() {
        return this.joindate;
    }

    getTotalArticles() {
        return this.totalarticles;
    }

    printInformation() {
        console.log("NAME: " + this.name);
        console.log("PASSWORD: " + this.password);
        console.log("JOIN DATE: " + this.joindate);
        console.log("TOTAL ARTICLES: " + this.totalarticles);
    }
}

var user = new User("UNREGISTERED", "UNREGISTERED", "UNREGISTERED", "UNREGISTERED");

function loadNewsFromFile() {
    var imagesS = getFromFile("images");
    var titlesS = getFromFile("titles");
    var subtitlesS = getFromFile("descriptions");
    var contentsS = getFromFile("contents");
    var datesS = getFromFile("dates");
    var authorsS = getFromFile("authors");
    if(titlesS == null) return;
    if(titlesS.includes("#%*")) {
        var length = titlesS.split("#%*").length;
        var start = total;
        total += length - 1;
        for(var x = start; x < start + length - 1; x++) {
            console.log("LOADING: " + titlesS.split("#%*")[x - start]);
            var dateFromFile = datesS.split("#%*")[x - start];
            var date = dateFromFile.split("-")[2] + "." + dateFromFile.split("-")[1] + "." + dateFromFile.split("-")[0];
            images[x] = imagesS.split("#%*")[x - start];
            titles[x] = titlesS.split("#%*")[x - start];
            subtitles[x] = subtitlesS.split("#%*")[x - start];
            contents[x] = contentsS.split("#%*")[x - start];
            dates[x] = date;
            authors[x] = authorsS.split("#%*")[x - start];
        }
    }
}

function loadNews() {
    images[0] = "images/basketbal.png";
    titles[0] = "Basketbalisté SPŠ MB získali druhé místo v okresním kole";
    subtitles[0] = "V úterý 18.10.2022 se konal turnaj středních škol v basketbalu ve sportovní hale MB. Šest družstev se utkalo o titul přeborníka okresu MB. Náš tým ve složení Vacula Eduard, Máj Richard, Hejduk Václav (všichni 3.C), Karel Vojtěch, Korda Jakub (oba 4.C), Hanitz Ondřej ( 1.A ), Nypl Štěpán, Havlíček Filip ( oba 1.D ), Král David, Nechaiev Vladyslav ( oba 1.E ) a Šákr Filip ( 1.B ) se postupně ve skupině utkal s týmy ISZŠ a 8G. V obou utkáních se po vyrovnaném průběhu podařilo zvítězit...";
    dates[0] = "14.04.2023";
    authors[0] = "Tomáš Josef Najman";
    contents[0] = "V úterý 18.10.2022 se konal turnaj středních škol v basketbalu ve sportovní hale MB. Šest družstev se utkalo o titul přeborníka okresu MB. Náš tým ve složení Vacula Eduard, Máj Richard, Hejduk Václav (všichni 3.C), Karel Vojtěch, Korda Jakub (oba 4.C), Hanitz Ondřej ( 1.A ), Nypl Štěpán, Havlíček Filip ( oba 1.D ), Král David, Nechaiev Vladyslav ( oba 1.E ) a Šákr Filip ( 1.B ) se postupně ve skupině utkal s týmy ISZŠ a 8G. V obou utkáních se po vyrovnaném průběhu podařilo zvítězit. V prvním utkání zejména díky výbornému výkonu Jakuba Kordy, který byl opět tahounem týmu po celý turnaj. Ve finále došlo k souboji s týmem ŠKODA AUTO. Bohužel Jakubův pěkný výkon nepodpořili dostatečně ostatní hráči (nepřesná střelba ), takže jsme prohráli a obsadili krásné druhé místo. Gratulujeme týmu a děkujeme za vzornou reprezentaci školy.<div class = 'articleSpace'></div>Zdroj: https://www.spsmb.cz/";
    images[1] = "images/atleti.png";
    titles[1] = "Atleti SPŠ MB čtvrtí na krajském kole a patnáctí v republice";
    subtitles[1] = 'Ve středu 5.10.2022 proběhlo krajské kolo Středoškolského atletického poháru v Kolíně na místním atletickém stadionu. Naše družstvo ve složení Jan Bečvařík, Matěj Kuntoš (oba 2.C), Martin Krubert, Jan Filipec (oba 2.B), Martin Hojný, Jan Hofman (oba 4.A), Václav Ježek (3.C), Vojtěch Karel (4.C), Martin Horák (2.A), František Jelínek (1.D), Jan Bobenič (1.A) a Adam Vostřel (2.D) se snažilo od začátku bojovat o medaile nebo dokonce o postup na republikové kolo. Bohlužel v závěru nám chybělo pár bodů, zejména z disciplín vrh koulí, dálka a běh na 400 m...';
    dates[1] = "14.04.2023";
    authors[1] = "Tomáš Josef Najman";
    contents[1] = 'Ve středu 5.10.2022 proběhlo krajské kolo Středoškolského atletického poháru v Kolíně na místním atletickém stadionu. Naše družstvo ve složení Jan Bečvařík, Matěj Kuntoš (oba 2.C), Martin Krubert, Jan Filipec (oba 2.B), Martin Hojný, Jan Hofman (oba 4.A), Václav Ježek (3.C), Vojtěch Karel (4.C), Martin Horák (2.A), František Jelínek (1.D), Jan Bobenič (1.A) a Adam Vostřel (2.D) se snažilo od začátku bojovat o medaile nebo dokonce o postup na republikové kolo. Bohlužel v závěru nám chybělo pár bodů, zejména z disciplín vrh koulí, dálka a běh na 400 m <div class = "articleSpace"></div> První disciplínou byla štafeta, která ve složení Krubert, Filipec, Bečvařík a Horák obsadila sedmé místo v čase 1:37,98min. V kouli závodil Martin Hojný (12,28m – 6. ) a Karel Vojtěch (10,25m – 15.). V dálce  Jan Filipec ( 559cm – 8. ) a Jan Hofman ( 534cm – 13. ).  Ve sprintu na 60 m slušně zabodovali Martin Horák ( 7,59s. – 5.místo ), Martin Krubert ( 7,61s. – 6.místo ) a Jan Bobenič ( 7,80s – 13. ). Do hry o medaile jsme se vrátili po velmi dobrém výkonu na 1500 m, kde si všichni tři borci zlepšili osobní rekordy. Vynikající byl zejména Václav Ježek (4:11,96min. – 4.), který do posledních metrů proháněl atletické reprezentanty ČR v této věkové kategorii. Skvěle běžel i František Jelínek (4:30,28min. – 7.) a Adam Vostřel (4:39,59min. – 9). Bodově nám pomohla výška, kterou zcela jasně vyhrál  Jan Hofman ( 180cm – 1. ) a  i Martin Hojný ( 164cm – 12. ) zde ukázal vysokou výkonnost. O medailích pak rozhodovala poslední disciplína, běh na 400 m. Výkony našich atletů byly o trochu horší než jsme očekávali: Martin Krubert ( 54,94s. – 12. ), Jan Filipec ( 56,15s. – 16. ) a Jan Bečvařík (56,61s. – 18. ). Bodový zisk 8513 bodů stačil na pěkné čtvrté místo v kraji a patnácté v celé republice, bohužel to nestačilo na postup na republikové finále ( z našeho krajského kola postupují všechny týmy co se umístily před námi). <div class = "articleSpace"></div>Zdroj: https://www.spsmb.cz/'
    images[2] = "images/atleti2.png";
    titles[2] = "Atleti zvítězili v okresním kole";
    subtitles[2] = 'Ve čtvrtek 22.9.2022 proběhlo okresní kolo Středoškolského atletického poháru na městském stadionu v Mladé Boleslavi. Naše družstvo ve složení Jan Bečvařík, Pavel Rousek, Matěj Kuntoš, (2.Cs), Martin Krubert, Jan Filipec (2.Bi), Martin Hojný, Jan Hofman (4.Ai), Václav Ježek (3.Cs), Karel Vojtěch (4.Cs), Martin Horák (2.Ai), Adam Vostřel (2.Ds) bojovalo skvěle od první disciplíny o postup na kraj o celkové vítězství.<div class="articleSpace"></div>Ve sprintu na 60 m zvítězil Martin Krubert (7,51s - 1.místo), dále bodoval Martin Horák (7,71s -4.). Na 400 m opět Martin Krubert (53,87s - 1.) a za ním Jan Bečvařík (57,71s - 4.)...';
    dates[2] = "14.04.2023";
    authors[2] = "Tomáš Urban";
    contents[2] = 'Ve čtvrtek 22.9.2022 proběhlo okresní kolo Středoškolského atletického poháru na městském stadionu v Mladé Boleslavi. Naše družstvo ve složení Jan Bečvařík, Pavel Rousek, Matěj Kuntoš, (2.Cs), Martin Krubert, Jan Filipec (2.Bi), Martin Hojný, Jan Hofman (4.Ai), Václav Ježek (3.Cs), Karel Vojtěch (4.Cs), Martin Horák (2.Ai), Adam Vostřel (2.Ds) bojovalo skvěle od první disciplíny o postup na kraj o celkové vítězství.<div class = "articleSpace"></div> Ve sprintu na 60 m zvítězil Martin Krubert (7,51s - 1.místo), dále bodoval Martin Horák (7,71s -4.). Na 400 m opět Martin Krubert (53,87s - 1.) a za ním Jan Bečvařík (57,71s - 4.). Na dlouhé trati 1500 m vynikajícím výkonem vyhrál Václav Ježek (4:40,12min. - 1.). Kousek za ním bodoval hezkým výkonem Adam Vostřel (4:40,12min. - 2). B kouli exceloval super hodem Martin Hojný (12,93m - 1.). Pár pěkných bodů přidal i Karel Vojtěch (11,26m - 4.). V dálce podali vyrovnané výkony Jan Filipec (576 cm - 2.). a Jan Hofman (568 - 3.). Výška skončila výhrou Jana Hofmana (181 - 1.) A druhým bodující, byl Martin Hojný (165 - 2.). Vynikající výkony našich atletů dovršila štafeta ve složení Krubert, Filipec Bečvařík a Horák výhrou v čase 1:37,80min.<div class = "articleSpace"></div> Bodový zisk 8559 bodů je třetí nejlepší v historii školy a znamenal výhru a postup na krajské finále. Všem závodníkům děkujeme za vzornou reprezentaci školy a gratulujeme k postupu. Držíme palce na krajském kole<div class = "articleSpace"></div>Zdroj: https://www.spsmb.cz/';
    images[3] = "images/prijimacky.jpg";
    titles[3] = "Na naší škole se konaly jednotné přijímací zkoušky";
    subtitles[3] = 'Budova Střední průmyslové školy bude otevřena vždy od 8:00 pro oba dny. Prosíme, aby rodiče nevodili své potomky do školy. Na chodbách budou dozory a o uchazeče se v případě potřeby postarají.<div class="articleSpace"></div>V minulém týdnu vám byli poštou doručeny dva dopisy. Na dopisech byli uvedeny datum, čas a místo konání a učebna konání JPZ...';
    dates[3] = "14.04.2023";
    authors[3] = "Stanislav Tesař";
    contents[3] = 'Na naší škole se konaly 13.4 a 14.4 jednotné přijímací zkoušky. Náhradní termíny se konají 10.5 a 11.5.<div class="articleSpace"></div>Budova Střední průmyslové školy bude otevřena vždy od 8:00 pro oba dny. Prosíme, aby rodiče nevodili své potomky do školy. Na chodbách budou dozory a o uchazeče se v případě potřeby postarají.<div class="articleSpace"></div>V minulém týdnu vám byli poštou doručeny dva dopisy. Na dopisech byli uvedeny datum, čas a místo konání a učebna konání JPZ.<div class="articleSpace"></div>První zkouška začíná v 8:30. Pokud uchazeč v době mezi zkouškami opustí budovu školy, škola za něj nenese odpovědnost.<div class="articleSpace"></div>Škola by měla obdržet výsledky JPZ v pátek 28.4.2023, výsledky náhradního termínu budou 18.5.2023. Ředitel školy zveřejní seznam přijatých uchazečů do 2 pracovních dnů od zpřístupnění hodnocení.<div class = "articleSpace"></div>Zdroj: https://www.spsmb.cz/';
    images[4] = "images/soutez.png";
    titles[4] = "Na naší škole proběhla recitační soutěž";
    subtitles[4] = "Na naší škole proběhla recitační soutěž dne 21.2.2023, které se účastnili žáci všech ročníků.";
    dates[4] = "14.04.2023";
    authors[4] = "Stanislav Tesař";
    contents[4] = 'Na naší škole proběhla recitační soutěž dne 21.2.2023, které se účastnili žáci všech ročníků.<div class="articleSpace"></div>V recitační soutěži v 1. kategorii byli nejlepší:<div class="articleSpace"></div>1.	místo Pavel Mík, 2.Ai<div class="articleSpace"></div>2.	místo Petr Dovičin a Tomáš Novák, 1.Bi<div class="articleSpace"></div>3.	místo Jan Vais, 1.Bi<div class="articleSpace"></div>V recitační soutěži v 2. kategorii byli nejlepší:<div class="articleSpace"></div>1.	místo Vladimír Šebesta, 4.Cs<div class="articleSpace"></div>2.	místo Tomáš Antoško, 4.Cs<div class="articleSpace"></div>3.	místo Ladislav Jareš, 3.Bi<div class="articleSpace"></div>Výherci obdrželi odměnu z fondu SRPŠ. Vítězové obou kategorií postoupily do okresního kola.<div class="articleSpace"></div>Blahopřeji a děkuji všem za účast<div class = "articleSpace"></div>Zdroj: https://www.spsmb.cz/';
}

function setUpNews() {
    var foundNews = "";
    var preView = '<div class="article"><div><img src="--IMAGE--" alt="" onclick="openArticle(--INDEX--)"></div><div><div class="articleT" onclick="openArticle(--INDEX--)">--TITLE--</div><div class="articleS">--SUBTITLE--</div><div class="author"><img src="images/user.png"><div class="authorInfo"><div class="authorN" onclick="openUser(--USERID--)">--NAME--</div><div class="authorD">--DATE--</div></div></div></div></div>';
    for(var x = total - 1; x >= 0; x--) {
        if(x >= 0) {
            console.log(authors[x]);
            var userID = 0;
            if(authors[x] == "Tomáš Urban") userID = -1;
            else if(authors[x] == "Tomáš Josef Najman") userID = -2;
            else if(authors[x] == "Stanislav Tesař") userID = -3;
            else userID = getIndexOfUserInFile("usernames", authors[x]);
            foundNews += preView.replace("--TITLE--", titles[x]).replace("--DATE--", dates[x]).replace("--NAME--", authors[x]).replace("--SUBTITLE--", subtitles[x]).replace("--IMAGE--", images[x]).replace("--MARGIN--", 10 - (-515 * (x - startTotal + 1))).replace("--USERID--", userID).replaceAll("--INDEX--", x);
        }
    }
    document.getElementsByClassName("body")[0].innerHTML = foundNews;
    document.querySelector(":root").style.setProperty("--pagesMargin", document.getElementsByClassName("body")[0].clientHeight + "px");
}

function setUpNewsByUser(user = "") {
    var foundNews = "";
    var preView = '<div class="article"><div><img src="--IMAGE--" alt="" onclick="openArticle(--INDEX--)"></div><div><div class="articleT" onclick="openArticle(--INDEX--)">--TITLE--</div><div class="articleS">--SUBTITLE--</div><div class="author"><img src="images/user.png"><div class="authorInfo"><div class="authorN" onclick="openUser(--USERID--)">--NAME--</div><div class="authorD">--DATE--</div></div></div></div></div>';
    for(var x = total - 1; x >= 0; x--) {
        if(x >= 0) {
            console.log(authors[x] + " " + user + " " + (authors[x] == user));
            if(authors[x] == user) {
                var userID = 0;
                if(authors[x] == "Tomáš Urban") userID = -1;
                else if(authors[x] == "Tomáš Josef Najman") userID = -2;
                else if(authors[x] == "Stanislav Tesař") userID = -3;
                else userID = getIndexOfUserInFile("usernames", authors[x]);
                foundNews += preView.replace("--TITLE--", titles[x]).replace("--DATE--", dates[x]).replace("--NAME--", authors[x]).replace("--SUBTITLE--", subtitles[x]).replace("--IMAGE--", images[x]).replace("--MARGIN--", 10 - (-515 * (x - startTotal + 1))).replace("--USERID--", userID).replaceAll("--INDEX--", x);
            }
        }
    }
    document.getElementsByClassName("body")[0].innerHTML += foundNews;
    document.querySelector(":root").style.setProperty("--pagesMargin", document.getElementsByClassName("body")[0].clientHeight + "px");
}

function setUpUsers() {
    var foundUsers = "";
    var preView = '<div class="userL"><div class="userI"><img src="images/user.png" alt=""></div><div class="userN" onclick="openUser(--INDEX--)">--NICK--</div><div class="userS"><div class="userJ"><div>Zaregistrován</div><div>--DATE--</div></div><div class="userA"><div>Příspěvky</div><div>--ARTICLES--</div></div></div></div>';
    foundUsers += preView.replace("--NICK--", "Tomáš Urban").replace("--DATE--", "2023-04-12").replace("--ARTICLES--", 1).replaceAll("--INDEX--", -1);
    foundUsers += preView.replace("--NICK--", "Tomáš Josef Najman").replace("--DATE--", "2023-04-12").replace("--ARTICLES--", 2).replaceAll("--INDEX--", -2);
    foundUsers += preView.replace("--NICK--", "Stanislav Tesař").replace("--DATE--", "2023-04-12").replace("--ARTICLES--", 2).replaceAll("--INDEX--", -3);
    for(var x = 0; x < getLengthOfFile("usernames") - 1; x++) {
        foundUsers += preView.replace("--NICK--", getFromFileByIndex("usernames", x)).replace("--DATE--", getFromFileByIndex("joindates", x)).replace("--ARTICLES--", getFromFileByIndex("totalarticles", x)).replaceAll("--INDEX--", x);
    }
    foundUsers = foundUsers.replaceAll("null", "");
    document.getElementsByClassName("body")[0].innerHTML = foundUsers;
}

function openUser(index = 0) {
    clearFile("clicked");
    saveToFile("clicked", index);
    openWebsite("user.html");
}

function openArticle(index = 0) {
    clearFile("clicked");
    saveToFile("clicked", index);
    openWebsite("article.html");
}