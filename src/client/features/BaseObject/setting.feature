@tag1
Feature: Set Attribute
  As a user of the BaseObject, I want to be able to set values using a set method

  @tag3
  Scenario: Set test to 123
    Given the BaseObject is instantiated
    When I set test to 123
    Then when I get test again the value should be 123
