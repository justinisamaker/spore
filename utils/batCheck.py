#!/usr/bin/python

import RPi.GPIO as GPIO
import time
import subprocess
from datetime import datetime

GPIO.setmode(GPIO.BCM)

pwrPin = 27
batPin = 17

GPIO.setup(pwrPin, GPIO.OUT)
GPIO.setup(batPin, GPIO.IN)

GPIO.output(pwrPin, GPIO.HIGH)


if not GPIO.input(batPin):
  print "LOW BATTERY!"
  print "System initiating a safe shutdown"
  filename = 'lowbat_{}.log'.format(datetime.strftime(datetime.now(), '%Y-%m-%d_%H-%M'))
  f = open(filename, 'w')
  print f.name
  subprocess.call(["sudo","shutdown","-h","now"])
