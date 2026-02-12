---
title: Contact OSC
sidenav: false
units:
    - name: Prohibited Personnel Practices, for Inquiries About Filing a Complaint with OSC
      contacts:
        - phone1: (202) 804-7000
        - phone2: (800) 872-9855
        - email: info@osc.gov
        - address: 1730 M Street, N.W., Suite 218, Washington, D.C., 20036-4505
    - name: Political Activity ("Hatch Act")
      contacts:
        - phone1: (800) 85-HATCH
        - phone2: (800) 854-2824
        - phone3: (202) 804-7002
        - email: hatchact@osc.gov
        - address: 1730 M Street, N.W., Suite 218, Washington, D.C,, 20036-4505
    - name: Whistleblower Disclosure Hotline, for Inquiries on How to Report Fraud, Waste, Abuse or Dangers to Health and Safety
      contacts:
        - phone1: (202) 804-7000
        - phone2: (800) 572-2249
        - email: info@osc.gov
        - address: 1730 M Street, N.W., Suite 218, Washington, D.C., 20036-4505
    - name: Uniformed Services Employment and Reemployment Rights Act (USERRA)
      contacts:
        - phone1: (202) 804-7022
        - email: userra@osc.gov
        - address: 1730 M Street, N.W., Suite 218, Washington, D.C., 20036-4505
    - name: For Inquiries from Members of the News Media
      contacts:
        - email: cwilliams@osc.gov
        - address: 1730 M Street, N.W., Suite 218, Washington, D.C., 20036-4505
    - name: For Inquiries from Congressional Offices
      contacts:
        - email: cwilliams@osc.gov
        - address: 1730 M Street, N.W., Suite 218, Washington, D.C., 20036-4505
    - name: OSC EEO Director
      contacts:
        - phone1: (202) 804-7000
        - phone2: (800) 872-9855
        - address: 1730 M Street, N.W., Suite 218, Washington, D.C., 20036-4505
    - name: OSC Headquarters
      contacts:
        - phone1: (202) 804-7000
        - phone2: (800) 872-9855
        - fax: (202) 254-3711
        - address: 1730 M Street, N.W., Suite 218, Washington, D.C., 20036-4505
    - name: San Francisco Bay Area Field Office
      contacts:
        - phone1: (510) 598-2065
        - fax: (510) 637-3474
    - name: Dallas Field Office
      contacts:
        - phone1: (214) 974-7075
        - phone2: (214) 767-2764
    - name: Midwest Field Office
      contacts:
        - phone1: (313) 335-8085
        - fax: (313) 226-5606
    - name: Requesting Speakers
      contacts:
        - email: certification@osc.gov
        - address: 1730 M Street, N.W., Suite 218, Washington, D.C., 20036-4505
    - name: OSC FOIA Office
      contacts:
        - phone1: (202) 804-7000
        - email: foiarequest@osc.gov
        - address: 1730 M Street, N.W., Suite 218, Washington, D.C., 20036-4505
    - name: Certification Program
      contacts:
        - email: certification@osc.gov
        - address: 1730 M Street, N.W., Suite 218, Washington, D.C., 20036-4505
---

###

## ​Uni​ts​

<ul class="usa-card-group padding-top-4">
  {%- for unit in units -%}  
  <li class="usa-card tablet-lg:grid-col-6 widescreen:grid-col-4">
    <div class="usa-card__container bg-base-lightest shadow-3 border-base-lightest">
      <div class="usa-card__header">      
        <div class="usa-card__heading font-body-s text-bold">{{ unit.name }}</div>
      </div>
      <div class="usa-card__body">
      {%- for contact in unit.contacts -%}
        {%- if contact.phone1 -%}
        <div class="margin-0">
            <div class="display-flex flex-align-center margin-0">
                <svg class="usa-icon margin-rght-1" aria-hidden="true" focusable="false" role="img">
                    <use href="/assets/img/sprite.svg#phone"></use>
                </svg>
                <span class="font-body-xs">{{ contact.phone1 }}</span>
            </div>  
        </div>      
        {%- endif -%}
        {%- if contact.phone2 -%}
        <div class="margin-0">
            <div class="display-flex flex-align-center margin-0">
                <svg class="usa-icon margin-rght-1" aria-hidden="true" focusable="false" role="img">
                    <use href="/assets/img/sprite.svg#phone"></use>
                </svg>
                <span class="font-body-xs">{{ contact.phone2 }}</span>
            </div>  
        </div>      
        {%- endif -%}
        {%- if contact.phone3 -%}
        <div class="margin-0">
            <div class="display-flex flex-align-center margin-0">
                <svg class="usa-icon margin-rght-1" aria-hidden="true" focusable="false" role="img">
                    <use href="/assets/img/sprite.svg#phone"></use>
                </svg>
                <span class="font-body-xs">{{ contact.phone3 }}</span>
            </div>  
        </div>      
        {%- endif -%}
        {%- if contact.fax -%}
        <div class="margin-0">
            <div class="display-flex flex-align-center margin-0">
                <svg class="usa-icon margin-rght-1" aria-hidden="true" focusable="false" role="img">
                    <use href="/assets/img/sprite.svg#fax"></use>
                </svg>
                <span class="font-body-xs">{{ contact.fax }}</span>
            </div>  
        </div>      
        {%- endif -%}
        {%- if contact.email -%}
        <div class="margin-0">
            <div class="display-flex flex-align-center margin-0">
                <svg class="usa-icon margin-rght-1" aria-hidden="true" focusable="false" role="img">
                    <use href="/assets/img/sprite.svg#mail"></use>
                </svg>
                <span class="font-body-xs">{{ contact.email }}</span>
            </div>  
        </div>      
        {%- endif -%}
        {%- if contact.address -%}
        <div class="margin-0">
            <div class="display-flex flex-align-center margin-0">
                <svg class="usa-icon margin-rght-1" aria-hidden="true" focusable="false" role="img">
                    <use href="/assets/img/sprite.svg#location_on"></use>
                </svg>
                <span class="font-body-xs">{{ contact.address }}</span>
            </div>  
        </div>      
        {%- endif -%}                            
      {%- endfor -%}  
      </div>
    </div>
  </li>
  {%- endfor -%}
</ul>  

