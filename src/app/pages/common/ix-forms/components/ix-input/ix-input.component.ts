import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'ix-input',
  templateUrl: './ix-input.component.html',
  styleUrls: ['./ix-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: IxInputComponent },
  ],
})
export class IxInputComponent implements ControlValueAccessor, AfterViewInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() prefixIcon: string;
  @Input() hint: string;
  @Input() tooltip: string;
  @Input() required: boolean;
  @Input() type: string;
  @Input() parseAndFormatInput: (value: string) => { parsed: string; formatted: string };

  @ViewChild('ixInput') elementRef: ElementRef<HTMLInputElement>;

  formControl = new FormControl(this).value as FormControl;

  value = '';
  formatted = '';
  isDisabled = false;

  onChange: (value: string | number) => void = (): void => {};
  onTouch: () => void = (): void => {};

  constructor(
    public controlDirective: NgControl,
    private cdr: ChangeDetectorRef,
  ) {
    this.controlDirective.valueAccessor = this;
  }

  get isInputMasked(): boolean {
    return !!this.parseAndFormatInput;
  }

  writeValue(value: string): void {
    let parsed = value;
    let formatted = value;
    if (this.isInputMasked && value) {
      const parsedAndFormatted = this.parseAndFormatInput(value);
      parsed = parsedAndFormatted.parsed;
      formatted = parsedAndFormatted.formatted;
      if (this.elementRef && this.elementRef.nativeElement) {
        this.elementRef.nativeElement.value = formatted;
      }
    }
    this.value = parsed;
    this.formatted = formatted;
    this.onChange(this.value);
    this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.value = this.formatted;
    this.onChange(this.value);
  }

  registerOnChange(onChange: (value: string | number) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouch = onTouched;
  }

  shouldShowResetInput(): boolean {
    return !this.isDisabled && this.hasValue();
  }

  hasValue(): boolean {
    return this.value && this.value.toString().length > 0;
  }

  input(value: string): void {
    this.value = value;
    this.formatted = value;
    if (this.isInputMasked && !!value) {
      const { parsed, formatted } = this.parseAndFormatInput(value);
      this.value = parsed;
      this.formatted = formatted;
    }
    this.onChange(this.value);
  }

  resetInput(): void {
    this.value = '';
    this.formatted = '';
    this.onChange('');
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  blur(): void {
    this.onTouch();
    if (this.isInputMasked && !!this.value) {
      const { parsed, formatted } = this.parseAndFormatInput(this.value);
      this.value = parsed;
      this.elementRef.nativeElement.value = formatted;
    }
    this.onChange(this.value);
    this.cdr.markForCheck();
  }
}
