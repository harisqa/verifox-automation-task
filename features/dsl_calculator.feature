Feature: As a user, I want to use the DSL Calculator so that I am able to select best possible tariff for me

  Scenario Outline: DSL Result List - verify result list
    Given the User is on www.verivox.de
    When he is on DSL calculator
      And he enters prefix/code Ihre Vorwahl as '030' with '<tariff>' Mbit/s bandwidth selection
      And clicks on the button labeled as JETZT VERGLEICHEN
    Then he should be able see the Result List page with all the available Tariffs

    Examples:
    | tariff |
    | 16     |
    | 50     |
    | 100    |
    | 250    |

  Scenario: Result List - verify Offer detail page
    Given the User is on www.verivox.de
      And he is on DSL calculator
      And he enters prefix/code Ihre Vorwahl as '030' with '16' Mbit/s bandwidth selection
      And clicks on the button labeled as JETZT VERGLEICHEN
      And he should be able see the Result List page with all the available Tariffs
    When he selects one of the listed Tariffs
      And clicks on mehr zum Tarif button
    Then he should be able see the details of the selected Tariff 
      And he should also see a button labeled as In 5 Minuten online wechseln

  Scenario: Lazy loading/pagination for loading the Result List
   Given the User is on www.verivox.de
      And he is on DSL calculator
      And he enters prefix/code Ihre Vorwahl as '030' with '16' Mbit/s bandwidth selection
      And clicks on the button labeled as JETZT VERGLEICHEN
      And he should be able see the Result List page with all the available Tariffs
      And there are more than '20' tariffs available
    When user scrolls down and clicks on weitere laden button
    Then there are more than '40' tariffs available
      And user scrolls down and clicks on weitere laden button
    Then there are more than '60' tariffs available
      And user scrolls down and clicks on weitere laden button
    Then there are more than '80' tariffs available
      And user scrolls down and clicks on weitere laden button
    Then there are more than '90' tariffs available
      And weitere laden button do not exist

#TODO: Refactor last scenario. Use single step for lazy load








    
    
    



