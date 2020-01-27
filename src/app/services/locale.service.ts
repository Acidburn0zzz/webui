import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { PreferencesService } from 'app/core/services/preferences.service';
import { T } from "app/translate-marker";

@Injectable()
export class LocaleService {
    t24 = T('(24 Hours)');
    constructor(public prefService: PreferencesService) { };

    getDateFormatOptions() {
        let options = [
            { label: moment().format('YYYY/MM/DD'), value: 'YYYY/MM/DD' },     
            { label: moment().format('MMMM D, YYYY'), value: 'MMMM D, YYYY' },
            { label: moment().format('D MMMM, YYYY'), value: 'D MMMM, YYYY' },
            { label: moment().format('MMM D, YYYY'), value: 'MMM D, YYYY' },
            { label: moment().format('D MMM YYYY'), value: 'D MMM YYYY' },
            { label: moment().format('MM/DD/YYYY'), value: 'MM/DD/YYYY' },
            { label: moment().format('DD/MM/YYYY'), value: 'DD/MM/YYYY' }
          ];
          return options;
    }

    getTimeFormatOptions() {
        let options = [
            { label: moment().format('hh:mm:ss a'), value: 'hh:mm:ss a Z' },
            { label: moment().format('hh:mm:ss A'), value: 'hh:mm:ss A Z' },
            { label: `${moment().format('HH:mm:ss')} ${this.t24}`, value: 'HH:mm:ss Z' },
        ];
        return options;
    }

    formatDateTime(date) {
        return moment(date).format(`${this.prefService.preferences.dateFormat} ${this.prefService.preferences.timeFormat}`);
    }

    saveDateTimeFormat(dateFormat, timeFormat) {
        this.prefService.preferences.dateFormat = dateFormat;
        this.prefService.preferences.timeFormat = timeFormat;
        this.prefService.savePreferences();
    }

    getPreferredDateFormat() {
        return this.prefService.preferences.dateFormat;
    }

    getPreferredTimeFormat() {
        return this.prefService.preferences.timeFormat;
    }

}