import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import {
  MeResponse,
  VictronInstallationsResponse,
} from '../types/victron.types';
import { VerifiedSystem } from '../types/shared.types';
import { appConfig } from '../../../config/app.config';

@Injectable()
export class VictronAdapter {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appCfg: ConfigType<typeof appConfig>,
  ) {}

  async verifyAndGetVictronSystem(
    accessToken: string,
  ): Promise<VerifiedSystem> {
    const meRes = await fetch(`${this.appCfg.victronApiBaseUrl}/users/me`, {
      headers: { 'X-Authorization': `Token ${accessToken}` },
    });

    if (!meRes.ok) {
      throw new BadRequestException(
        'Could not connect to your Victron VRM account. Check your access token.',
      );
    }

    const me = (await meRes.json()) as MeResponse;
    const idUser = me?.record?.idUser;

    const instRes = await fetch(
      `${this.appCfg.victronApiBaseUrl}/users/${idUser}/installations`,
      {
        headers: { 'X-Authorization': `Token ${accessToken}` },
      },
    );

    const data = (await instRes.json()) as VictronInstallationsResponse;

    if (!data.success || !data.records?.length) {
      throw new BadRequestException(
        'No installations found on your Victron VRM account.',
      );
    }

    const site = data.records[0];

    return {
      model: site.name,
      serialNumber: site.identifier,
      installationId: String(site.idSite),
      ratedCapacityKwh: site.pvMax
        ? parseFloat((site.pvMax / 1000).toFixed(2))
        : 0,
      timezone: site.timezone,
      isOnGrid: site.is_on_grid,
      hasGenerator: Boolean(site.hasGenerator),
      mqttHost: site.mqtt_host,
    };
  }
}
