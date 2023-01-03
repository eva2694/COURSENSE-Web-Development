
    COURSENSE: 
**Opis:**

CourSense je platforma, ki uporabniku predstavi številne spletne tečaje. Vsebuje spletne tečaje različnih ponudnikov in njihove ocene, tako da uporabnik lahko glede na temo, ceno in oceno poišče najboljši spletni tečaj na voljo. Uporabniki lahko seveda prispevajo z lastno oceno.

**Zaslonske maske:**
- **Home**: Domača stran z naslovom, povezavo do iskanja, opisom in kontaktnim obrazcem, pri čemer smo uporabili [nodemailer](https://www.npmjs.com/package/nodemailer).
- **Signup/Login**: Obrazec za prijavo/registracijo.
- **Search**: Stran, ki prikaže seznam spletnih tečajev. Privzeto gre za razporeditev po popularnosti, uporabnik pa lahko rezultate tudi filtrira glede na iskanje ali kategorijo ter razvrsti po ceni.
- **Course details**: Stran, ki se prikaže, ko kliknemo na določen tečaj. Vsebuje podatke o njem, njegovo oceno in komentarje. Tu uporabnik lahko doda komentar ali ga izbriše. Kot zunanji vir smo uporabili [JSpell Checker API](https://rapidapi.com/page-scholar-inc-page-scholar-inc-default/api/jspell-checker). Uporabnik lahko preveri, koliko tipkarskih napak je v njegovi oceni spletnega tečaja. Pri tem smo uporabili tudi node knjižnico [axios](https://www.npmjs.com/package/axios).
- **Profile**: Prikazuje uporabnikov profil in omogoča urejanje lastnega profila.

**Navodila in podatki za namestitev in zagon aplikacije**
- Razvojna verzija/lokalno:
    1) $npm i
    2) $cd angular
    3) $npm i
    4) nastavimo okoljske spremenljivke (NODE_ENV=...
       MONGODB_ATLAS_URI=povezava
       JWT_SECRET=geslo1
       MAIL=geslo2)
    5) $ng serve
    6) $cd ..
    7) $nodemon app
    8) klik na [povezavo](http://localhost:4200)


**[Povezava](https://coursense.onrender.com) do aplikacije**(produkcijska verzija)

**Navodila za pogon v dockerju:**

1) _$docker-compose up_

2) _klik na [povezavo](http://localhost:3000)_

**Dve dodatni knjižnjici in njun namen uporabe:**
- uporabili smo knjižnico **nodemailer** in **axios**:
    - **Axios** je knjižnica JavaScript, ki  omogoča pošiljanje zahtev HTTP iz spletnega brskalnika. Uporabili smo jo za pošiljanje podatkov na strežnik in za prejemanje podatkov s strežnika pri integraciji z zunanjim virom (JSpell)
    - **Nodemailer** je knjižnica JavaScript, ki se uporablja za pošiljanje elektronske pošte prek Node.js. Uporabili smo jo za pošiljanje enostavnih sporočil, čeprav se jo lahko uporabljan za pošiljanje sporočil z večji zmogljivostjo, kot so HTML-oblikovana sporočila, sporočila s prilogami in tako naprej.

**Validacija vnosov uporabnika:**
- **Dodajanje lastne ocene tečaja**: Ocena je omejena med 1 in 5, vsa polja so obvezna.
- **Kontaktni obrazec**: Vsa polja so obvezna, mail mora biti v veljavnem formatu.
- **Urejanje profila**: Vsa polja so obvezna.

**Uporabniške vloge:**
- **Admin**: ima poleg vseh funkcionalnosti, ki jih lahko uporablja prijavljan uporabnik možnost narediti izbris celotne baze in vzpostavitve začetnega stanja.
- **Prijavljen**: ima poleg vseh funkcionalnosti, ki jih lahko uporablja neprijavljen uporabnik, tudi možnost dodajanja komentarjev na spletne tečaje, dostopa do svojega profila in urejanja le-tega.
- **Neprijavljen**: ima dostop do domače strani, seznama tečajev, ter prikaza podrobnosti tečajev. Uporablja lahko tudi kontaktni obrazec. Razen kontaktnega obrazca, smo pri tovrstnem uporabniku nastavili, da lahko dobi ustrezen odgovori od strežnika le pri GET metodah.

**Primerjava delovanja v različnih brskalnikih:**

Razlike med večjimi brskalniki (Google Chrome in Edge) so neopazne in jih ni moč zaznati. Aplikacija se prilagodi velikost zaslona, ki jo ponuja vsak brskalnik s svojim uporabniškim vmesnikom. Pisava in velikosti pisave ostajajo enake. Manjša razlika, ki se pojavi med brskalnikom Chrome in Edge je ta, da se spletna splikacija v Edgu hitreje naloži. Oba večja spletna brskalnika ponudita tudi shranjevanje gesel ob tem ko se uporabnik prvič registrira, ter samodejno izpolnjevanje polj. 

V ostalih brskalnikih, ki niso tako popularni, kot je naprimer Safari ali Brave, večjih razlik ni moč opaziti. Opazimo lahko manjše razlike pri prikazu favicona, ker vsak brskalnik ponuja svoje ozadje uporabniškega vmesnika ter različen prikaz velikosti naslovov spletnih strani (mišljen je tisti naslov, ki se izpiše v zavihku).

