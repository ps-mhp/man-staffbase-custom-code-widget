# Kod niestandardowy

Widżet „Kod niestandardowy” to narzędzie do wszystkiego, czego nie oferują standardowe funkcje systemu CMS:
specjalnego formatowania, celowego ukrycia
elementu, niewielkiej interakcji.

**Sam w sobie nie wyświetla niczego.** Na opublikowanej stronie jest
niewidoczny i nie zajmuje miejsca. Zawiera jedynie kod, który wprowadzisz w
oknie dialogowym konfiguracji:

- **CSS** zmienia wygląd strony. Działa on na **całej stronie**,
  a nie tylko w obszarze widżetu.
- **JavaScript** zmienia zachowanie strony i pozwala na jej dowolną
  modyfikację.

## Zanim zaczniesz

Ten widget wymaga znajomości programowania. Nie ma żadnego mechanizmu, który
zapobiegałby sytuacji, w której błąd uniemożliwiłby działanie strony — widget co prawda
przechwytuje błędy, ale „błędny, ale poprawny” kod i tak zadziała. Kto chce jedynie
osadzić obraz, tabelę lub wpis, powinien skorzystać z innych
widżetów.

Zasada ogólna: najpierw sprawdź, czy pożądany efekt można uzyskać za pomocą
zwykłego widżetu. Kod niestandardowy to ostateczność, a nie pierwszy wybór.

## Gdzie działa kod

| Miejsce | JavaScript | CSS |
| --- | --- | --- |
| Opublikowana strona | działa | działa |
| Podgląd | działa | działa |
| Edytor CMS (widok edycji) | **nie** działa | **nie** działa |

W edytorze w miejscu widżetu widoczna jest jedynie karta z pierwszymi wierszami
zapisanego kodu. Jest to zamierzone: w przeciwnym razie błędny skrypt
zepsułby właśnie ten interfejs, który próbujesz naprawić. Do
testowania należy więc zawsze używać **podglądu**.

Z tego samego powodu na tej stronie dokumentacji nie jest wyświetlany **żaden przykład na żywo**
— w przeciwnym razie kod działałby na dokumentacji zamiast na Państwa stronie.
