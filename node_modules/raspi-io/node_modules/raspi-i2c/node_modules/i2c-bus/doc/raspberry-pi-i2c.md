## Configuring I2C on the Raspberry Pi

This article describes how to configure I2C on the Raspberry Pi. It assumes
that release 2015-01-31 or later of the Raspbian operating system is being
used. It also assumes that the device tree, which is enabled by default, is
enabled.

To enable I2C add the following line to `/boot/config.txt`. The raspi-config
tool can also be used to enable I2C under "Advanced Options"

```
dtparam=i2c_arm=on
```

To enable userspace access to I2C add the following line to `/etc/modules`

```
i2c-dev
```

### Allow I2C without root privileges

Create a file called `99-i2c.rules` in directory `/etc/udev/rules.d` with the
following content:

```
SUBSYSTEM=="i2c-dev", MODE="0666"
```

This will give all users access to I2C and sudo need not be specified when
executing programs using i2c-bus. A more selective rule should be used if
required.

After performing the above steps, reboot the Raspberry Pi.
